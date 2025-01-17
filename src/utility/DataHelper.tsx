import { FunctionElement } from "./Interfaces";

// Function to extract an array of numbers corresponding to a given key from objects in an array
export function extract(arr: any[], key: string): number[] {
  return arr.map((obj) => obj?.[key]);
}

// Function to extract other information (id, status, effort, startDate, endDate) from each object in an array
export function extractOtherInformation(arr: any[], key: string): { id: number, status: string }[] {
  return arr.map((obj) => ({
    id: obj?.id,
    status: obj?.status,
    effort: obj?.effort,
    startDate: obj?.startDate,
    endDate: obj?.endDate
  }));
}

// Function to replace the 'id' field in each object with the 'functionId' field
export function changeIdToFunctionId(objArray: any[]): any[] {
  return objArray.map(obj => {
    return {
      ...obj,
      id: obj.functionId // Replace 'id' with 'functionId'
    };
  });
}

// Function to filter an array of objects by checking if their function applications contain a specified set of application IDs
export function filterFunctionsByApplicationId(arr: any[], ids: number[]): any[] {
  return arr.filter((obj) => {
    const filtered = obj?.functionApplication.some((application) => ids.includes(application.application.id));
    return filtered;
  });
}

// Function to filter an array by matching the 'id' of each element against a list of IDs
export function matchFunctionsByFunctionId(elements: any[], ids: number[]): any[] {
  const filteredElements = elements.filter((element) => ids.includes(element.id));
  return filteredElements;
}

// Function to match elements by 'id' and attach additional properties (effort, startDate, endDate, status) from a corresponding array of IDs
export function matchFunctionsByFunctionId_2(elements: any[], ids: { id: number, effort: number, startDate: Date, endDate: Date, functionStatusId: number}[]): any[] {
  const filteredElements = elements.filter((element) => 
    ids.some((idObj) => idObj.id === element.id)
  );

  // Attach additional properties (effort, status, startDate, endDate) to each matched element
  const result = filteredElements.map((element) => {
    const matchingIdObj = ids.find((idObj) => idObj.id === element.id);
    return {
      ...element,
      effort: matchingIdObj?.effort,
      status: matchingIdObj?.functionStatusId,
      startDate: matchingIdObj?.startDate,
      endDate: matchingIdObj?.endDate,
    };
  });

  return result;
}

// Interface for a tree node structure
export interface TreeNode {
  id: number;
  name: string;
  startDate: Date | null;
  endDate: Date | null;
  effort: number | null;
  children?: TreeNode[];
  lowestLevel: boolean;
}

// Recursive function to find a tree node by ID
export function getNodeById(root: TreeNode, id: number): TreeNode | null {
  if (root?.id === id) {
    return root; // Return the node if the ID matches
  }
  if (root?.children) {
    // Recursively search in the children
    for (const child of root.children) {
      const foundNode = getNodeById(child, id);
      if (foundNode) {
        return foundNode; // Return the node if found in the children
      }
    }
  }

  return null; // Return null if no match is found
}

// Recursive function to get IDs of all children that are at the lowest level in the tree
export function getChildrenIds(root: any): number[] {
  let childrenIds: number[] = [];

  function recursivelyGetChildrenIds(node: TreeNode) {
    if (node?.lowestLevel) {
      childrenIds.push(node.id); // Collect ID if it's the lowest level node
    }
    if (node?.children) {
      // Recursively get IDs from the children
      for (const child of node.children) {
        recursivelyGetChildrenIds(child);
      }
    }
  }

  recursivelyGetChildrenIds(root);
  return childrenIds; // Return the collected IDs
}

// Recursive function to get all child nodes that are at the lowest level in the tree
export function getChildren(root: any): any[] {
  let children: any[] = [];

  function recursivelyGetChildren(node: TreeNode) {
    if (node?.lowestLevel) {
      children.push(node); // Collect the node if it's the lowest level node
    }
    if (node?.children) {
      // Recursively get child nodes from the children
      for (const child of node.children) {
        recursivelyGetChildren(child);
      }
    }
  }

  recursivelyGetChildren(root);
  return children; // Return the collected nodes
}

// Function to convert an ISO date string to a JavaScript Date object, adjusting for time zones
export function isoStringToDate(isoString: string): Date {
  // Split the ISO string into its components
  const dateParts = isoString.split(/\D+/);

  // Create a new Date object
  const returnDate = new Date();

  // Set the date components
  returnDate.setUTCFullYear(parseInt(dateParts[0]));
  returnDate.setUTCMonth(parseInt(dateParts[1]) - 1); // Months are zero-indexed
  returnDate.setUTCDate(parseInt(dateParts[2]));

  // Set the time components
  returnDate.setUTCHours(parseInt(dateParts[3]));
  returnDate.setUTCMinutes(parseInt(dateParts[4]));
  returnDate.setUTCSeconds(parseInt(dateParts[5]));
  returnDate.setUTCMilliseconds(parseInt(dateParts[6]));

  // Adjust for the time zone offset, if present
  let timezoneOffsetHours = 0;
  if (dateParts[7] || dateParts[8]) {
    let timezoneOffsetMinutes = dateParts[8] ? parseInt(dateParts[8]) / 60 : 0;
    timezoneOffsetHours = parseInt(dateParts[7]) + timezoneOffsetMinutes;
    if (isoString.substr(-6, 1) === "+") {
      timezoneOffsetHours *= -1; // Adjust based on timezone
    }
  }

  returnDate.setHours(returnDate.getHours() + timezoneOffsetHours);

  return returnDate; // Return the final Date object
}
