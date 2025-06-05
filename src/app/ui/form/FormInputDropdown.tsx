import React from "react";
import { FormControl, FormHelperText, FormLabel, IconButton, MenuItem, Select } from "@mui/material";
import { Controller } from "react-hook-form";
import ClearIcon from '@mui/icons-material/ClearSharp'
import { FormInputProps } from "@/utility/Interfaces";

//Component to select an option passed and reset it with the clear button
export const FormInputDeletableDropdown: React.FC<FormInputProps> = ({
  name,
  control,
  label,
  options,
  rules,
  defaultValue, 
  onSelectedChange,
  disabled
}) => {

	//functions to wrap the options passed into MenuItems
  const generateSingleOptions = () => {
    return options.map((option: any) => {
      return (
        <MenuItem key={option.id} value={option.id}>
          {option.name}
        </MenuItem>
      );
    });
  };

  return (
    <FormControl size={"small"} disabled={disabled} fullWidth>
      <FormLabel>
              {label}
      </FormLabel>
      <Controller
        rules={rules}
        render={({
          field: { onChange, value },
          fieldState: { error },
        }) => (
          <Select 
            onChange={(e) => {
              onChange(e);
              if(onSelectedChange){
                onSelectedChange();
              }
              
            }} 
            
            error={!!error}
            value={value}

						//Delete element button
            IconComponent={() => (
              <IconButton sx={{marginRight:1}}
                onClick={() => {
                  onChange(undefined);
                  if(onSelectedChange){
                    onSelectedChange();
                  }
                }}
                disabled={disabled}
                onMouseDown={(event) => event.preventDefault()}
              >
                <ClearIcon />
              </IconButton>
            )}>
            {generateSingleOptions()}
          </Select>
        )}
        control={control}
        name={name}
        defaultValue={defaultValue} 
      />
    </FormControl>
  );
};

//Component to select an option passed (not clerable)
export const FormInputDropdown: React.FC<FormInputProps> = ({
	name,
	control,
	label,
	options,
	defaultValue,
	onSelectedChange, 
  }) => {

	//functions to wrap the options passed into MenuItems
	const generateSingleOptions = () => {
	  return options.map((option: any) => {
		return (
		  <MenuItem key={option.id} value={option.id}>
			{option.name}
		  </MenuItem>
		);
	  });
	};
  
	return (
	  <FormControl size={"small"} fullWidth>
		<FormLabel>
		  {label}
		</FormLabel>
		<Controller
		  render={({ 
        field: { value, onChange, onBlur, ref },
        fieldState: { error },
      }) => (
        <>
          <Select
            onChange={(e) => {
              onChange(e);
              if (onSelectedChange) {
                onSelectedChange(e.target.value);
              }
              onBlur();
            } }
            value={value}
            error={Boolean(error)}
            required
            inputRef={ref}
            onBlur={onBlur}
          >
            {generateSingleOptions()}
          </Select>

						{/* Label used in case of errors */}
						<FormHelperText
            sx={{
              color: 'error.main',
            }}
          >
              {error?.message ?? ''}
          </FormHelperText>
        </>
		  )}
		  control={control}
		  name={name}
		  defaultValue={defaultValue}
		/>
    
	  </FormControl>
	);
  };
