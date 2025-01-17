import { Grid, IconButton, Button } from "@mui/material";
import {
  FormLabel,
} from "@mui/material";
import { useFieldArray } from "react-hook-form";
import ClearIcon from "@mui/icons-material/ClearSharp";
import { FormInputDeletableAutocomplete } from "./FormInputAutocomplete";
import { useEffect, useState } from "react";
import { FormGrid } from "@/styles/style";
import { FormInputProps } from "@/utility/Interfaces";

//component used to add more than one application 
export const FormInputApplicationAdd: React.FC<FormInputProps> = ({
  name,
  control, // Pass control from useForm
  options,
  label,
  disabled,
  selectedValues,
  onChange,
}) => {
	//use a field array to keep trucks of the applications added since the number of the applications selected is variable 
  const { fields, append, remove } = useFieldArray<{ id?: any, name?: any}>({ control, name});
  const [filteredOptions, setFilteredOptions] = useState([]);

  useEffect(() => {
    if(onChange){
		  onChange();
    }
    updateFilteredOption()
  }, [fields, selectedValues]);

	//when adding or removing a selection, change the available options
  const updateFilteredOption = () => {
    const filteredOptions = options.filter((option) => {
      return !selectedValues?.some((selectedOption) => option?.id === selectedOption?.id);
    });
    setFilteredOptions(filteredOptions);
  }

  const handleAdd = () => {
    append({});
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  return (
    <div>
      <FormLabel>{label}</FormLabel>
      {fields.map((element, index) => (
        <Grid container spacing={2} alignItems="center" key={element.id} sx={{mb:1}}>

					{/* Select component */}
          <FormGrid item xs={11.5}>
            <FormInputDeletableAutocomplete
              name={`${name}[${index}]`}
              control={control}
              options={filteredOptions}
              disabled={disabled}
              onSelectedChange={updateFilteredOption}
            />
          </FormGrid>

					{/* Remove Button */}
          <FormGrid item xs={.5}>
            <IconButton onClick={() => handleRemove(index)} disabled={disabled}>
              <ClearIcon />
            </IconButton>
          </FormGrid>
        </Grid>
      ))}

			{/* Add another field Button */}
      <Grid container>
        <FormGrid item xs={12}>
          <Button disabled={disabled} onClick={handleAdd}>Add Application</Button>
        </FormGrid>
      </Grid>
    </div>
  );
};