import React from "react";
import { Controller } from "react-hook-form";
import { Checkbox, FormControl, FormLabel, Grid } from "@mui/material";
import { FormInputProps } from "@/utility/Interfaces";


//Form for simple text
export const FormInputCheckbox = ({ name, control, label, onSelectedChange, disabled }: FormInputProps) => {

	//function to handle the checkbox selection change 
  const handleCheckboxChange = () => {
    if(onSelectedChange){
      onSelectedChange();
    } 
  };

  return (
    <FormControl size={"medium"} variant={"outlined"}>
      <Grid container alignItems="center">
        <Grid item xs={4}>
          <FormLabel component="legend">{label}</FormLabel>
        </Grid>
        <Grid item xs={2}>
          <Controller
            name={name}
            control={control}
            render={({ field }) => (

							/* CheckBox */
              <Checkbox
                sx={{ maxWidth: 40 }}
                value={name}
                disabled={disabled}
                checked={field.value === true}
                onChange={(event) => {
                  field.onChange(event);
                  handleCheckboxChange();
                }}
              />
            )}
          />
        </Grid>
      </Grid>
    </FormControl>
  );
};