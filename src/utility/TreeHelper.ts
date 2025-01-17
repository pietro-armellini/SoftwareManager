import { FunctionElement, ParentFunction } from "./Interfaces";

// Recursive function to find the full parent hierarchy of an element
export function findParentFunction(element: FunctionElement, elements: FunctionElement[]): ParentFunction | null {
  if (element.parentFunctionId === null) {
    return null; // If no parent, return null
  }

  const parent = elements.find(e => e.id === element.parentFunctionId);

  if (parent) {
    // Recursively find the parent function and build the parent hierarchy
    return {
      id: parent.id,
      name: parent.name,
      parentFunction: findParentFunction(parent, elements) // Recursive call to find the parent of the current parent
    };
  }
  return null; // In case the parent is not found (edge case)
}

// Function to build a parent hierarchy for a specific element by ID
export function buildParentHierarchy(elements: FunctionElement[], elementId: number): ParentFunction | null {
  const element = elements.find(e => e.id === elementId);
  if (element) {
    return findParentFunction(element, elements); // Call the recursive function to build the hierarchy
  }
  return null; // Return null if the element is not found
}

// Process the array of elements and add their parent hierarchies
export function processFunctionElements(elements: FunctionElement[]): FunctionElement[] {
  return elements.map(element => ({
    ...element,
    parentFunction: buildParentHierarchy(elements, element.id) // Attach the parent hierarchy to each element
  }));
}

// Function to retrieve the names of all parent functions and return them in an array
export function getParentNames(parentFunction: ParentFunction | null): string[] {
  let names: string[] = [];
  let currentParent = parentFunction;

  // Collect all parent names in a list
  while (currentParent) {
    names.push(currentParent.name);
    currentParent = currentParent.parentFunction || null; // Move to the next parent in the hierarchy
  }

  return names.reverse(); // Reverse the order so the root parent comes first
}

// Function to build a tree structure from the elements array, starting with a given root
export function buildTree(elements, rootName, mainTree, funcId) {
  const map = {};
  const tree:any[] = [];
  let children:any[] = [];
  const newRootElement = { id: "new_root", name: rootName, functionLevel: { id: 0, name: "no" }, parentFunctionId: null, children, lowestLevel: false };
  tree.push(newRootElement);

  // First, map all elements to their IDs and initialize an empty 'children' array
  for (const element of elements) {
    const { id, parentFunctionId } = element;
    map[id] = { ...element, children: [] };

    // If the element has no parent, attach it to the root
    if (parentFunctionId === null) {
      newRootElement.children.push(map[id]);
    }
  }

  // Then, link each element to its parent by adding it to the parent's 'children' array
  for (const element of elements) {
    const { id, parentFunctionId } = element;

    if (parentFunctionId !== null) {
      const parent = map[parentFunctionId];
      parent.children.push(map[id]);
    }
  }

  // If we're not building the main tree, return the function node and its children
  if (!mainTree && funcId !== null) {
    const functionNode = map[funcId];
    const children = functionNode.children;
    return [functionNode, ...children];
  }

  return tree; // Return the entire tree
}

// Function to filter the tree, keeping only the branches that include specified leaves
export function filterTree(elements, leaves, rootName) {
  const map = {};
  const tree:any[] = [];
  const includedIds = new Set();

  // Create a new root element for the filtered tree
  let children:any[] = [];
  const newRootElement = { id: 0, name: rootName, parentFunctionId: null, children };
  tree.push(newRootElement);

  // Map all elements to their IDs and initialize empty 'children' arrays
  for (const element of elements) {
    const { id, parentFunctionId } = element;
    map[id] = { ...element, children: [] };

    if (parentFunctionId === null) {
      newRootElement.children.push(map[id]);
    }
  }

  // Link each element to its parent
  for (const element of elements) {
    const { id, parentFunctionId } = element;

    if (parentFunctionId !== null) {
      const parent = map[parentFunctionId];
      parent.children.push(map[id]);
    }
  }

  // Traverse the tree and include only the necessary elements (those that are leaves)
  function traverse(element) {
    if (leaves.includes(element.id)) {
      includedIds.add(element.id); // Mark as included
      return element;
    }

    const children = element.children.map(traverse).filter(child => includedIds.has(child?.id));
    if (children.length > 0) {
      includedIds.add(element.id);
      return { ...element, children }; // Include this element if any of its children are included
    }
    return null; // Otherwise, exclude it
  }

  const filteredTree = traverse(newRootElement);
  return filteredTree ? [filteredTree] : []; // Return the filtered tree
}

// Function to count the total number of elements in a tree
export function countElements(elements: any[]): number {
  let count = 0;

  for (const element of elements) {
    if (!element.children || element.children.length === 0) {
      count += 1; // Count this element if it has no children
    } else if (element.children) {
      count += countElements(element.children); // Recursively count children
    }
  }

  return count;
}

// Function to add a status to each node in the tree based on a firmwareId
export function addStatusToTree(tree, id, statusFilterId: number) {
  // Find the status for the current node based on the firmwareId
  function findStatus(node, id) {
    if (node?.lowestLevelFunctionStatus && Array.isArray(node?.lowestLevelFunctionStatus)) {
      for (let status of node.lowestLevelFunctionStatus) {
        if (status.firmwareId === id) {
          return status.functionStatusId; // Return the matching status ID
        }
      }
    }
    return null;
  }

  // Recursively traverse the tree and add status to each node
  function traverseAndAddStatus(node, id) {
    node.status = findStatus(node, id); // Add status to the current node

    // Mark node for removal if it doesn't match the status filter
    if (node.status != null && statusFilterId != null && node.status != statusFilterId) {
      node.toRemove = true;
    } else {
      node.toRemove = false;
    }

    // Recursively traverse the children if any
    if (node.children && Array.isArray(node.children)) {
      for (let child of node.children) {
        traverseAndAddStatus(child, id);
      }
    }
  }

  // Start the recursive process
  if (tree != null) {
    traverseAndAddStatus(tree, id);
  } else {
    tree = [];
  }

  return tree; // Return the updated tree with status
}

//given an element return the color based on its "status" propriety
export const getColor = (node: FunctionElement) : string | undefined => {
  if(node.lowestLevel){
    //NOT IMPLEMENTED
    if(node.status==0){
      return "#E8E8E8"
    }
    //NOT STARTED
    if(node.status==1){
      return "lightgray" //GRAY
    }
    //IMPLEMENTATION ONGOING
    if(node.status==2){
      return "gold" //YELLOW
    }
    //R&D TEST ONGOING
    if(node.status==3){
      return "orange" //ORANGE
    }
    //SAE TEST ONGOING
    if(node.status==4){
      return "dodgerblue" //LIGHTBLUE
    }
    //FIELD TEST ONGOING
    if(node.status==5){
      return "MediumOrchid" //LIGHTPURPLE
    }
    //FINISHED
    if(node.status==6){
      return "green" //GREEN
    }
  }
}

// Recursive function to traverse the tree and set label color
export function setLabelColors(node) {
  // Set label color based on the node's lowestLevel property
  if(node.status==undefined){
    node.label = {
      ...node.label,
      color: "lightgray", 
    }; 
  }

  if(node.toRemove==true){
    node.label = {
      ...node.label,
      color: "lightgray", 
    }; 
  }

  node.itemStyle = {
    ...node.itemStyle,
    color: getColor(node), 
  };

  // If the node has children, recursively set their label colors
  if (node.children && node.children.length > 0) {
    node.children = node.children.map(child => setLabelColors(child));
  }

  return node;
}

/* 
	Colors of the parents depend on the children status: Parent with all children of the same 
	color gets their color, otherwise black
*/
export function updateParentColors(node) {
  if (node.children && node.children.length > 0) {
    // Recursively process all children first
    node.children = node.children.map(child => updateParentColors(child));

    // Check if any child has a defined status
    const hasDefinedStatusChild = node.children.some(child => child.status!=undefined || child.include!=undefined);
    const hasChildToNotRemove = node.children.some(child => child.toRemove==false)

    const firstChildColor = node.children[0]?.itemStyle?.color; // Get the color of the first child
    const allChildrenSameColor = node.children.every(child => child.itemStyle?.color == firstChildColor);

    // If current node has status undefined but has a child with defined status, set color to black
    if (node.status==undefined && hasDefinedStatusChild && hasChildToNotRemove) {
      node.label = {
        ...node.label,
        color: "black", 
      };
      node.include=true; 
      node.toRemove=false;
      if(allChildrenSameColor){
        node.itemStyle = {
          ...node.itemStyle,
          color: firstChildColor,
        };
      }
    }
    else{
      node.toRemove=true;
    }
  }

  return node;
}
