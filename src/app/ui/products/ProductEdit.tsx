import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { FormInputText } from "../form/FormInputText";
import { useForm } from "react-hook-form";

import { Button, CircularProgress, Divider, styled } from '@mui/material';
import { useState } from 'react';
import { ProductAddFormSchema } from '@/utility/ZodHelper';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';


//Component to edit products
export default function ProductEdit({ elementToEdit, handleCloseFromParentDialog }) {

  const [loading, setLoading] = useState(false); // Loading state
  
	//default form's values
  const defaultValues = {
    name: elementToEdit.name,
  };

  type FormFields = z.infer<typeof ProductAddFormSchema>;

  const { handleSubmit, control } = useForm<FormFields>({
    mode: "onBlur",
    reValidateMode: "onBlur",
    resolver: zodResolver(ProductAddFormSchema),
    defaultValues: defaultValues,
  });	

	//function to handle submit
  const onSubmit = (data: FormFields) => {
    setLoading(true)
    fetch('/api/products/editProduct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        { 
          "id": elementToEdit.id,
          "name": data.name,
        }),
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Network response was not successful.');
      }
    })
    .then(data => {
			//code == 1 => success
      if(data.code == 1){
        handleCloseFromParentDialog();
      }
    }).catch(() => setLoading(false)) //set loading to false if the result is an error
    
  };

  return (
    <Box sx={{flexGrow: 1, pl:3, pr:3, mt:0, mb:3}} >
      <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
        Edit Product
      </Typography>
      <Divider />
			{/* Loading component */}
      {loading ? ( 
          <Box display="flex" alignItems="center" justifyContent="center" sx={{mt:5}}>
            <CircularProgress /> {/* Loading spinner */}
          </Box>
      ):(
      <form noValidate autoComplete="off">
        <Grid sx={{ml:-3, mt:0}} container spacing={3}>
          <Grid item xs={12}>
                <FormInputText name="name" control={control} label="Name"/>
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="center" sx={{mt:5}}>
          <Button sx={{mr:3, p:1}} variant="contained" onClick={handleSubmit(onSubmit)}>
            Edit Product
          </Button>
        </Box>
      </form>
      )}
    </Box>
  );
}