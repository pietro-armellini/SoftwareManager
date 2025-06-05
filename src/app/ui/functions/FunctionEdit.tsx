import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { FormInputText } from "../form/FormInputText";
import { useForm } from "react-hook-form";

import { Button, CircularProgress, Divider } from '@mui/material';
import { FormInputDropdown } from '../form/FormInputDropdown';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormGrid } from '@/styles/style';
import { FormInputFunctionAutocomplete } from '../form/FormInputAutocomplete';
import { FormInputCheckbox } from '../form/FormInputCheckbox';
import { useEffect, useState } from 'react';
import { processFunctionElements } from '@/utility/TreeHelper';
import { FunctionAddFormSchema } from '@/utility/ZodHelper';
import { FunctionElement } from '@/utility/Interfaces';


//Component to edit Functions
export default function FunctionEdit({ elementToEdit, handleCloseFromParentDialog }) {
	
	//Options to select
	const [functionsOption, setFunctionsOption] = useState<FunctionElement[]>([]);
  const [functionLevelsOption, setFunctionLevelOption] = useState([]);
	
	//state variable to save the selected functions, 
	// both coming from the database query or from the manual functions add dialog
  const [selectedFunctions, setSelectedFunctions] = useState<FunctionElement[]>([]);
  const [loading, setLoading] = useState(true); // Loading state


	async function fetchFunctions() {
    const response = await fetch("/api/functions/list");
    const jsonData = await response.json();
		//process elements: add to each element a chain of parents til they reach the root node
    const processedFunctions = processFunctionElements(jsonData.data);
    setFunctionsOption(processedFunctions);  
    return jsonData  
  }
	
  async function fetchFunctionLevels() {
		const response = await fetch("/api/utils/functionlevels");
		const jsonData = await response.json();
		setFunctionLevelOption(jsonData.data);
    return jsonData  
  }

	//async functions to wait for all the fetches to be over before setting the loading variable to true
  async function fetchWaiter() {
    setLoading(true)
    await Promise.all([fetchFunctionLevels(), fetchFunctions()]);
    setLoading(false)
  }

  useEffect(() => {
    fetchWaiter()
  }, []);

	//default form's values
	const defaultValues = {
		name: elementToEdit.name,
		lowestLevelFunction: elementToEdit.lowestLevel,
		functionLevel: elementToEdit.functionLevel.id,
		parentId: elementToEdit.parentFunction,
		applications: [],
	};

  type FormFields = z.infer<typeof FunctionAddFormSchema>;
 
  const { handleSubmit, control, watch, getValues, setValue } = useForm<FormFields>({
    mode: "onBlur",
    reValidateMode: "onBlur",
    resolver: zodResolver(FunctionAddFormSchema),
    defaultValues: defaultValues
  });

	//function to handle submit
  const onSubmit = (data: FormFields) => {
    setLoading(true)
    fetch('/api/functions/editFunction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        { 
					"id": elementToEdit.id,
          "name": data.name,
          "lowestLevelFunction": data.lowestLevelFunction,
          "functionLevel": data.functionLevel,
          "parentId": data.parentId?.id,
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
    }).catch(() => setLoading(false));  //set loading to false if the result is an error    
  };

	//set the parent options only to the ones with has a parent level to the functionLevel selected
	const updateFilteredOption = () => {
    setValue("parentId", undefined)
    const filteredOptions = functionsOption.filter((option) => option?.functionLevelId == getValues("functionLevel")-1  )
    setSelectedFunctions(filteredOptions);
  }

	//function to get if the functionLevel selected is Behaviour or Function (first and second)
	//if the selected level is one of these then reset the checkbox and the selected applications
	//because only Core and Module can be lowest level functions
  const getFunctionLevelStatus = () => {
    if (getValues("functionLevel")==1 || getValues("functionLevel")==2){
      if(getValues("lowestLevelFunction")==true){
        setValue("lowestLevelFunction", false)
        setValue("applications", [])
      }
      return true;
    }
    return false;
  }

  return (
    <Box sx={{flexGrow: 1, paddingLeft:3, paddingRight:3, marginTop:0, marginBottom:3}} >
      <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
        Edit Function
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
            <Grid sx={{margin:0}} container spacing={3}>

						{/* Input: Name */}
						<Grid item xs={12} sm={6} lg={4}>
							<FormInputText name="name" control={control} label="Name" /* rules={{ required: "This field is required" }} *//>
						</Grid>

							{/* Input: Function Level */}
			        <Grid item xs={12} sm={6} lg={4}>
                <FormInputDropdown
                  name="functionLevel"
                  control={control}
                  label="Function Level"
                  options={functionLevelsOption}
                  onSelectedChange={updateFilteredOption}
                />
              </Grid>

							{/* Input: Parent Function */}
			        <Grid item xs={12} lg={4}>
                <FormInputFunctionAutocomplete
                  name="parentId"
                  control={control}
                  label="Parent Function"
                  disabled={!watch("functionLevel") || getValues("functionLevel")==1}
                  options={selectedFunctions}
                />
              </Grid>
              <Grid item xs={12}><Divider/></Grid>

							{/* Input: Lowest Level Function */}
			        <Grid item xs={12} sm={6} lg={4}>
                <FormInputCheckbox
                  control={control}
                  name={"lowestLevelFunction"}
                  label={"Lowest Level Function"} 
                  onSelectedChange={() => setValue("applications", [])}
                  disabled={getFunctionLevelStatus()}
                />
              </Grid>
							
            </Grid>
          </Grid>
					</Grid>
      <Grid container spacing={3} sx={{marginLeft:-3, pt:3}}>

					<Grid item xs={12} sm={12} sx={{textAlign:{sm: "center", xs:"center"}}}>
						<Button sx={{m:0, p:1}} variant="contained" onClick={handleSubmit(onSubmit)}>
							Edit Product
						</Button>
					</Grid>
			</Grid>
      </form>
      )}
    </Box>
  );
}