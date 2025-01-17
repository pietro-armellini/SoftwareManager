import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { FormInputText } from "../form/FormInputText";
import { useForm } from "react-hook-form";
import { useState } from 'react';
import { Button, CircularProgress, Divider } from '@mui/material';
import { useRouter } from 'next/navigation';
import { CustomerAddFormSchema } from '@/utility/ZodHelper';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';


//Component to add new customers
export default function CustomerAdd() {
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();
  
	//default valus for form
  const defaultValues = {
    name: "",
  };

  type FormFields = z.infer<typeof CustomerAddFormSchema>;

  const { handleSubmit, reset, control} = useForm<FormFields>({
    mode: "onBlur",
    reValidateMode: "onBlur",
    resolver: zodResolver(CustomerAddFormSchema),
    defaultValues: defaultValues,
  });	

	//function to handle submit
  const onSubmit = (data: FormFields) => {
    setLoading(true)
    fetch('/api/customers/addCustomer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        { 
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
        router.push("../../customers?succ")
      }
    }).catch(() => setLoading(false));  //set loading to false if the result is an error
  };


  return (
    <Box sx={{flexGrow: 1, paddingLeft:3, paddingRight:3, marginTop:0, marginBottom:3}} >
      <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
        Add New Customer
      </Typography>
      <Divider />
			{/* Loading component */}
      {loading ? ( // Check if data is loading
          <Box display="flex" alignItems="center" justifyContent="center" sx={{mt:5}}>
            <CircularProgress /> {/* Loading spinner */}
          </Box>
      ):(
      <form noValidate autoComplete="off">
        <Grid container spacing={3} sx={{marginLeft:-6}}>
          <Grid item xs={12}>
            <Typography sx={{ ml:3, mt:3}} variant="h6" component="div">
                Customer Information
              </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid sx={{margin:0}} container spacing={3}>
              <Grid item xs={12}>
                <FormInputText name="name" control={control} label="Name"/>
              </Grid>
            </Grid>
          </Grid>
          
        </Grid>
        <Box display="flex" justifyContent="center" sx={{mt:5}}>
        <Button sx={{mr:3, p:1}} variant="outlined" onClick={() => reset()}>
          Reset Data
        </Button>
        <Button variant="contained" onClick={handleSubmit(onSubmit)}>
          Add Customer
        </Button>
        </Box>
      </form>)}
    </Box>
    
  );
}