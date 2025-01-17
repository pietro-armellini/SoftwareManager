import React from 'react';
import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { FormHelperText, FormLabel } from "@mui/material";
import { FormInputProps } from '@/utility/Interfaces';

//Form for simple text
export const FormInputText = ({ name, control, label, multiline, rules }: FormInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({
        field: { value, onChange, onBlur, ref },
        fieldState: { error },
      }) => (
        <div>
          <FormLabel>
            {label}
          </FormLabel>
          <TextField
            size="small"
            required
            onChange={onChange}
            inputRef={ref}
            onBlur={onBlur}
            value={value} 
            fullWidth
            variant="outlined"
            multiline={multiline ? true : false} 
            error={Boolean(error)}
            />
						{/* Label used in case of errors */}
            <FormHelperText
              sx={{
                color: 'error.main',
              }}
            >
              {error?.message ?? ''}
            </FormHelperText>
        </div>
      )}
    />
  );
};