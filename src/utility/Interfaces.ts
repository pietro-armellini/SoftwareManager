export interface FunctionElement {
  id: number;
  name: string;
  startDate: Date | null;
  endDate: Date | null;
  effort: number | null;
  functionLevelId: number;
  parentFunctionId: number | null;
  lowestLevel: boolean;
  parentFunction: ParentFunction | null;
  functionLevel: {
    id: number;
    name: string;
  };
  functionApplication: any[];
  status?: any;
}

export interface ParentFunction {
  id: number;
  name: string;
  parentFunction?: ParentFunction | null;
}

export interface FormInputProps {
  name: string;
  control: any;
  label?: string;
  setValue?: any;
  disabled?: boolean;
  multiline?: boolean;
  options?;
  rules?: any;
  defaultValue?: any;
  isValid? : boolean;
  selectedValues?: any[];
  onSelectedChange? : (value?:any) => void;
  onChange? : () => void;
  
}