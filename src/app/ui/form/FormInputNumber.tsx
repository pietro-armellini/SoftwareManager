import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { FormLabel } from "@mui/material";
import { FormInputProps } from "@/utility/Interfaces";

//Form for simple number
export const FormInputNumber = ({ name, control, label, disabled, onSelectedChange }: FormInputProps) => {
    return (
      <Controller
        name={name}
        control={control}
        render={({
          field: { onChange, value },
          fieldState: { error },
        }) => (
          <div>
            <FormLabel>
              {label}
            </FormLabel>
            <TextField
              helperText={error ? error.message : null}
              size="small"
			        disabled={disabled}
              type="number"
              error={!!error}
              onChange={(e) => {
                onChange(e);
              }}
              onBlur={(e) => {
                if (onSelectedChange) { 
                  onSelectedChange(e.target.value); 
                }
              }}
              value={value}
              fullWidth
              variant="outlined"
            />
          </div>
        )}
      />
    );
  };