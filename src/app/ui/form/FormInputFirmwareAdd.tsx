import { Grid, IconButton, Button, styled } from "@mui/material";
import {
  FormLabel,
} from "@mui/material";
import { useFieldArray } from "react-hook-form";
import ClearIcon from "@mui/icons-material/ClearSharp";
import { FormInputAutocomplete, FormInputDeletableAutocomplete } from "./FormInputAutocomplete";
import { useEffect, useState } from "react";
import { FormInputProps } from "@/utility/Interfaces";
import { FormGrid } from "@/styles/style";

//component used to add more than one application 
export const FormInputFirmwareAdd: React.FC<FormInputProps> = ({
  name,
  control, // Pass control from useForm
  options,
  label,
  disabled,
  selectedValues,
  onChange,
}) => {
	//use a field array to keep trucks of the firmwares added since the number of the firmwares selected is variable 
  const { fields, append, remove } = useFieldArray({ control, name });
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
          <Button disabled={disabled} onClick={handleAdd}>Add Firmware</Button>
        </FormGrid>
      </Grid>
    </div>
  );
};