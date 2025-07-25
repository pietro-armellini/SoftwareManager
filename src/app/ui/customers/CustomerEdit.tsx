import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { FormInputText } from "../form/FormInputText";
import { useForm } from "react-hook-form";
import { useState } from 'react';
import { Button, CircularProgress, Divider } from '@mui/material';
import { CustomerAddFormSchema } from '@/utility/ZodHelper';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

//Component to edit customers
export default function CustomerEdit({ elementToEdit, handleCloseFromParentDialog }) {
  const [loading, setLoading] = useState(false); // Loading state

	//default form's values
  const defaultValues = {
    name: elementToEdit.name,
  };

  type FormFields = z.infer<typeof CustomerAddFormSchema>;
	//function to handle submit
  const { handleSubmit, control } = useForm<FormFields>({
    mode: "onBlur",
    reValidateMode: "onBlur",
    resolver: zodResolver(CustomerAddFormSchema),
    defaultValues: defaultValues,
  });	

	//function to handle submit
  const onSubmit = (data: FormFields) => {
    setLoading(true)
    fetch('/api/customers/editCustomer', {
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
    }).catch(() => setLoading(false));//set loading to false if the result is an error    
  };

  return (
    <Box>
      <Typography sx={{ mt: 4, mb: 2, ml:4 }} variant="h6" component="div">
        Edit Customer
      </Typography>
      			<Divider sx={{ml:4}} />
			{/* Loading component */}
      {loading ? ( // Check if data is loading
          <Box display="flex" alignItems="center" justifyContent="center" sx={{mt:5}}>
            <CircularProgress /> {/* Loading spinner */}
          </Box>
      ):(
      <form noValidate autoComplete="off">
				<Grid container spacing={2} sx={{pl:4, pr:4, pb:4}} >
          <Grid item xs={12}>
						<FormInputText name="name" control={control} label="Name"/>
					</Grid>
					<Grid item xs={12} sm={12} sx={{textAlign:{sm: "ecenter", xs:"center"}}}>
						<Button sx={{mr:3, p:1}} variant="contained" onClick={handleSubmit(onSubmit)}>
							Edit Customer
						</Button>
					</Grid>
				</Grid>
      </form>
      )}
    </Box>
  );
}