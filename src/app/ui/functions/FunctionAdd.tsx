'use client'

import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { FormInputText } from "../form/FormInputText";
import { useForm } from "react-hook-form";
import { useState, useEffect } from 'react';
import { Button, CircularProgress, Divider } from '@mui/material';
import { useRouter } from 'next/navigation';
import { FormInputDropdown } from '../form/FormInputDropdown';
import { FormInputCheckbox } from '../form/FormInputCheckbox';
import { FormInputApplicationAdd } from '../form/FormInputApplicationAdd';
import { extract } from '@/utility/DataHelper';
import { FormInputFunctionAutocomplete } from '../form/FormInputAutocomplete';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { FormGrid } from '@/styles/style';
import { FunctionAddFormSchema } from '@/utility/ZodHelper';
import { processFunctionElements } from '@/utility/TreeHelper';
import { FunctionElement } from '@/utility/Interfaces';


//Component to add new functions
export default function FunctionAdd() {
  const [loading, setLoading] = useState(true); // Loading state
	//Options to select
  const [functionOptions, setFunctionOptions] = useState<FunctionElement[]>([]);
	const [functionLevelOptions, setFunctionLevelOptions] = useState([]);
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [applicationOptions, setApplicationOptions] = useState([]);

	//filter functions options based on the function level selected
	const [filteredFunctionOptions, setFilteredFunctionOptions] = useState<FunctionElement[]>([]);

  const router = useRouter();

  async function fetchFunctions(): Promise<any> {
      const response = await fetch("/api/functions/list");
      const jsonData = await response.json();
			//process elements: add to each element a chain of parents til they reach the root node
      const processedFunctions = processFunctionElements(jsonData.data);
      setFunctionOptions(processedFunctions);
      return jsonData;
  }
  async function fetchFunctionLevels(): Promise<any>{
	    const response = await fetch("/api/utils/functionlevels");
      const jsonData = await response.json();
      setFunctionLevelOptions(jsonData.data);  
      return jsonData;
  }
  async function fetchApplications(): Promise<any> {
      const response = await fetch("/api/applications/list");
      const jsonData = await response.json();
      setApplicationOptions(jsonData.data);  
      return jsonData;
  }

	//async functions to wait for all the fetches to be over before setting the loading variable to true
  async function fetchWaiter() {
		setLoading(true);
    await Promise.all([fetchFunctions(), fetchFunctionLevels(), fetchApplications()]);
    setLoading(false)
  }
  
  useEffect(() => {
    fetchWaiter()    
  }, []);

	//default valus for form
  const defaultValues = {
    name: "",
    lowestLevelFunction: false,
    functionLevel: undefined,
    parentId: undefined,
    applications: [],
  };
  
  type FormFields = z.infer<typeof FunctionAddFormSchema>;
  
  const { handleSubmit, reset, control, getValues, watch, setValue } = useForm<FormFields>({
    mode: "onBlur",
    reValidateMode: "onBlur",
    resolver: zodResolver(FunctionAddFormSchema),
    defaultValues: defaultValues
  });

	//function to handle submit
  const onSubmit = (data: FormFields) => {
      const applications = extract(data.applications, "id");
      setLoading(true)
      fetch('/api/functions/addFunction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        { 
          "name": data.name,
          "lowestLevelFunction": data.lowestLevelFunction,
          "functionLevel": data.functionLevel,
          "parentId": data.parentId?.id,
          "applications": applications,
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
			router.push("../../functions?succ")
		  }
    }).catch(() => setLoading(false));  //set loading to false if the result is an error
	};
  
	//set the parent options only to the ones with has a parent level to the functionLevel selected
	const updateFilteredOption = () => {
    setValue("parentId", undefined)
    const filteredOptions = functionOptions.filter((option) => option?.functionLevelId == getValues("functionLevel")-1  )
    setFilteredFunctionOptions(filteredOptions);
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
        Add New Function
      </Typography>
      <Divider />

			{/* Loading component */}
      {loading ? ( // Check if data is loading
          <Box display="flex" alignItems="center" justifyContent="center" sx={{mt:5}}>
            <CircularProgress /> {/* Loading spinner */}
          </Box>
      ):(
      <form autoComplete="off">
        <Grid container spacing={3} sx={{marginLeft:-6}}>
          <Grid item xs={12}>
            <Typography sx={{ ml:3, mt:3}} variant="h6" component="div">
                Function Information
              </Typography>
          </Grid>	
          <Grid item xs={12}>
            <Grid sx={{margin:0}} container spacing={3}>

							{/* Input: Name */}
              <FormGrid item xs={4}>
                <FormInputText name="name" control={control} label="Name" />
              </FormGrid>

							{/* Input: Function Level */}
			        <FormGrid item xs={4}>
                <FormInputDropdown
                  name="functionLevel"
                  control={control}
                  label="Function Level"
                  options={functionLevelOptions}
                  onSelectedChange={updateFilteredOption}
                />
              </FormGrid>
							
							{/* Input: Parent Function */}
			        <FormGrid item xs={4}>
                <FormInputFunctionAutocomplete
                  name="parentId"
                  control={control}
                  label="Parent Function"
                  disabled={!watch("functionLevel") || getValues("functionLevel")==1}
                  options={filteredFunctionOptions}
                />
              </FormGrid>
              <FormGrid item xs={12}><Divider/></FormGrid>  

							{/* Input: Lowest Level Function */}
			        <FormGrid sx={{textAlign:'center'}} item xs={6}>
                <FormInputCheckbox
                  control={control}
                  name={"lowestLevelFunction"}
                  label={"Lowest Level Function"} 
                  onSelectedChange={() => setValue("applications", [])}
                  disabled={getFunctionLevelStatus()}
                />
              </FormGrid>

							{/* Input: Applications */}
              <FormGrid item xs={6}>Parent
                <FormInputApplicationAdd
                  control={control}
                  name={"applications"}
                  options={applicationOptions}
                  disabled={!watch("lowestLevelFunction")}
                  label={"Connect Application"}
                  onChange={() => setSelectedApplications(getValues("applications") as any)}
                  selectedValues={selectedApplications}
                />
              </FormGrid>
            </Grid>
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="center" sx={{mt:5}}>
        <Button sx={{mr:3, p:1}} variant="outlined" onClick={() => reset()}>
          Reset Data
        </Button>
        <Button variant="contained" onClick={handleSubmit(onSubmit)}>
          Add Function
        </Button>
        </Box>
      </form>
      )}
    </Box>
    
  );
}
