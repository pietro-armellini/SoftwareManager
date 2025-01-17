import React from 'react';
import { Controller } from 'react-hook-form';
import { FormHelperText, FormLabel, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FormInputProps } from '@/utility/Interfaces';

//Form for simple text
export const FormInputDate = ({ name, control, label, disabled }: FormInputProps) => {
  return (
    <><FormLabel>{label}</FormLabel><Controller
      name={name}
      control={control}
      render={({ 
        field: { value, onChange },
        fieldState: { error },
      }) => (
        <div>
          <DatePicker
            disabled={disabled}
            value={value || null}
            onChange={(e) => {
              onChange(e);
            }}
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
      )} /></>
  );
};
