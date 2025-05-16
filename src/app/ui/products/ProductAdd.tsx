import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { FormInputText } from "../form/FormInputText";
import { useForm } from "react-hook-form";
import { useState } from 'react';
import { Button, CircularProgress, Divider } from '@mui/material';
import { useRouter } from 'next/navigation';
import { ProductAddFormSchema } from '@/utility/ZodHelper';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';


//Component to add new products
export default function ProductAdd() {
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();

	//default valus for form
  const defaultValues = {
    name: "",
  };

  type FormFields = z.infer<typeof ProductAddFormSchema>;

  const { handleSubmit, reset, control} = useForm<FormFields>({
    mode: "onBlur",
    reValidateMode: "onBlur",
    resolver: zodResolver(ProductAddFormSchema),
    defaultValues: defaultValues,
  });	

	//function to handle submit
  const onSubmit = (data: FormFields) => {
    setLoading(true)
    fetch('/api/products/addProduct', {
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
        router.push("../../products?succ")
      }
    }).catch(() => setLoading(false));   //set loading to false if the result is an error
  };


  return (  
    <Box>
      <Typography sx={{ mt: 4, mb: 2, ml:4 }} variant="h6" component="div">
        Add New Product
      </Typography>
      <Divider sx={{ml:4}} />
			{/* Loading component */}
      {loading ? ( // Check if data is loading
          <Box display="flex" alignItems="center" justifyContent="center" sx={{mt:5, mb:5}}>
            <CircularProgress /> {/* Loading spinner */}
          </Box>
      ):(
      <form noValidate autoComplete="off">
        <Grid container spacing={2} sx={{pl:4, pr:4, pb:4}} >
          <Grid item xs={12}>
            <Typography sx={{ ml:0, mt:3}} variant="h6" component="div">
                Product Information
              </Typography>
          </Grid>
					<Grid item xs={12}>
						<FormInputText name="name" control={control} label="Name"/>
          </Grid>
        	<Grid item xs={12} sm={6} sx={{textAlign:{sm: "right", xs:"center"}}}>
						<Button variant="outlined" onClick={() => reset()} sx={{p:1, width: { xs: '50%', sm: 'auto' }}}>
							Reset Data
						</Button>
					</Grid>
					<Grid item xs={12} sm={6} sx={{textAlign:{sm: "left", xs:"center"}}}>
						<Button variant="contained" onClick={handleSubmit(onSubmit)} sx={{p:1, width: { xs: '50%', sm: 'auto' }}}>
							Add Product
						</Button>
					</Grid>
				</Grid>
      </form>
      )}
    </Box>
  );
}