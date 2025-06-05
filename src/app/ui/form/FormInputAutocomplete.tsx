import React, {  } from "react";
import { FormControl, FormLabel, TextField, Autocomplete, styled, lighten, darken, Typography, Grid, FormHelperText } from "@mui/material";
import { Controller } from "react-hook-form";
import { FormInputProps } from "@/utility/Interfaces";
import { getParentNames } from "@/utility/TreeHelper";

export const FormInputAutocomplete: React.FC<FormInputProps> = ({
  name,
  control,
  label,
  options,
  defaultValue,
  onSelectedChange,
  disabled,
}) => {

  const generateSingleOptions = () => {
    const tmp = options.map((option: any) => ({
      label: option.name,
      key: option.id,
      lowestLevel: option.lowestLevel,
      functionLevel: option.functionLevel?.id,
      functionLevelName: option.functionLevel?.name,
      parentFunction: option.parentFunction?.name
    }));
    tmp.sort((a, b) => (a.functionLevel || 0) - (b.functionLevel || 0));
    return tmp;
  };

  const GroupHeader = styled('div')(({ theme }) => ({
    position: 'sticky',
    top: '-8px',
    padding: '4px 10px',
    color: theme.palette.primary.main,
    backgroundColor: lighten(theme.palette.primary.light, 0.85),
    ...theme.applyStyles('dark', {
      backgroundColor: darken(theme.palette.primary.main, 0.8),
    }),
  }));
  
  const GroupItems = styled('ul')({
    padding: 0,
  });
  

  return (
    <FormControl size={"small"}>
      <FormLabel>{label}</FormLabel>
      <Controller
        render={({ field: { onChange, value } }) => (
          <Autocomplete
            onChange={(event, newValue) => {
              onChange(newValue);
              if (onSelectedChange) { // Renamed prop
                onSelectedChange(); // Renamed prop
              }
            }}
            value={value}
            disabled={disabled}
            getOptionLabel={(option) => option.label || ""}
            options={generateSingleOptions()}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" size="small" fullWidth />
            )}
            
            groupBy={(option) => option.functionLevelName}  
            renderGroup={(params) => (
              <li key={params.key}>
                <GroupHeader>{params.group}</GroupHeader>
                <GroupItems>{params.children}</GroupItems>
              </li>
            )}
            isOptionEqualToValue={(option, value) => option.key === value?.id}
          />
        )}
        control={control}
        name={name}
        defaultValue={defaultValue}
      />
    </FormControl>
  );
};

export const FormInputFunctionAutocomplete: React.FC<FormInputProps> = ({
  name,
  control,
  label,
  options,
  defaultValue, // New prop added
  onSelectedChange, // Renamed prop
  disabled,
}) => {


  const GroupHeader = styled('div')(({ theme }) => ({
    position: 'sticky',
    top: '-8px',
    padding: '4px 10px',
    color: theme.palette.primary.main,
    backgroundColor: lighten(theme.palette.primary.light, 0.85),
    ...theme.applyStyles('dark', {
      backgroundColor: darken(theme.palette.primary.main, 0.8),
    }),
  }));
  
  const GroupItems = styled('ul')({
    padding: 0,
  });
  

  return (
    <FormControl size={"small"} fullWidth>
      <FormLabel>{label}</FormLabel>
      <Controller
        render={({ 
          field: { value, onChange, onBlur, ref },
          fieldState: { error },
        }) => (
          <Autocomplete
            onChange={(event, newValue) => {
              onChange((newValue==undefined?undefined:newValue));
              if(onSelectedChange){
                onSelectedChange();
              }
            }}
            value={value}
            disabled={disabled}
            getOptionLabel={(option) => option.name || "ERROR"}
            options={options.sort((a, b) => (a.functionLevelId || 0) - (b.functionLevelId || 0))}
            renderInput={(params) => (
              <><TextField
                {...params} 
                variant="outlined" 
                size="small" 
                value={value}
                error={Boolean(error)}
                inputRef={ref}
                onBlur={onBlur}
                fullWidth />
               <FormHelperText
                sx={{
                  color: 'error.main',
                }}
              >
                {error?.message ?? ''}
              </FormHelperText></>
            )}
            
            groupBy={(option) => option.functionLevel.name}  
            renderGroup={(params) => (
              <li>
                <GroupHeader>{params.group}</GroupHeader>
                <GroupItems>{params.children}</GroupItems>
              </li>
            )}
            renderOption={(props, option, state) => (
              <li {...props}>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography>
                      {option.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}> 
                  {getParentNames(option)[3] !== undefined && (
                      <Typography sx={{fontSize:10, color: "gray"}}>
                        Framework Layer: <b>{getParentNames(option)[2]}</b>
                      </Typography>
                    )}
                  {getParentNames(option)[2] !== undefined && (
                      <Typography sx={{fontSize:10, color: "gray"}}>
                        Operational Layer: <b>{getParentNames(option)[1]}</b>
                      </Typography>
                    )}
                    {getParentNames(option)[1] !== undefined && (
                      <Typography sx={{fontSize:10, color: "gray"}}>
                        Strategic Layer: <b>{getParentNames(option)[0]}</b>
                      </Typography>
                    )}
                    
                  </Grid>
                </Grid>
              </li>
            )}
          />
        )}
        control={control}
        name={name}
      />
    </FormControl>
  );
};

export const FormInputDeletableAutocomplete: React.FC<FormInputProps> = ({
  name,
  control,
  label,
  options,
  defaultValue, // New prop added
  onSelectedChange, // Renamed prop
  disabled,
}) => {
  

  return (
    <FormControl size={"small"}>
      <FormLabel>{label}</FormLabel>
      <Controller
        render={({ field: { onChange, value } }) => (
          <Autocomplete
            onChange={(event, newValue) => {
              onChange(newValue);
              if (onSelectedChange) { // Renamed prop
                onSelectedChange(newValue); // Renamed prop
              }
            }}
            value={value}
            disabled={disabled}
            getOptionLabel={(option) => option.name || ""}
            options={options}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" size="small" fullWidth />
            )}
            disableClearable={true}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
          />
        )}
        control={control}
        name={name}
        defaultValue={defaultValue}
      />
    </FormControl>
  );
};

