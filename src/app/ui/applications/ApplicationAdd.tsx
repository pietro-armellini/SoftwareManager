import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { FormInputText } from "../form/FormInputText";
import { useForm } from "react-hook-form";
import { useState, useEffect } from 'react';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, Divider, IconButton, Step, StepLabel, Stepper } from '@mui/material';
import { useRouter } from 'next/navigation';
import { FormInputApplicationAdd } from '../form/FormInputApplicationAdd';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { SelectedFunctionsList } from './SelectedFunctionsList';
import { extract, getChildrenIds, getNodeById, matchFunctionsByFunctionId } from '@/utility/DataHelper';
import { FormInputFunctionAutocomplete } from '../form/FormInputAutocomplete';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import { ApplicationAddFormSchema } from '@/utility/ZodHelper';
import { FormGrid } from '@/styles/style';
import { FunctionElement } from '@/utility/Interfaces';
import { processFunctionElements } from '@/utility/TreeHelper';


//Component to add new applications
export default function ApplicationAdd() {
	//Options to select
	const [applicationOptions, setApplicationOptions] = useState([]);
	const [functionOptions, setFunctionOptions] = useState<FunctionElement[]>([]);

	const [loading, setLoading] = useState(true); // Loading state
	const [tree, setTree] = useState<any[]>([]);
	const [selectedApplications, setSelectedApplications] = useState<any[]>([]);
	//state variable to save the selected functions, 
	//both coming from the application selected or from the manual functions add dialog
	const [selectedLowestLevelFunctions, setSelectedLowestLevelFunctions] = useState<FunctionElement[]>([]);
	const [showDialog, setShowDialog] = useState(false);

	//state variable to keep track of the state of the Stepper component
	const [activeStep, setActiveStep] = React.useState(0);
	const router = useRouter();

	async function fetchApplicationOptions() {
		const response = await fetch("/api/applications/list");
		const jsonData = await response.json();
		setApplicationOptions(jsonData.data);
		return jsonData
	}
	async function fetchFunctionOptions() {
		const response = await fetch("/api/functions/detailedlist");
		const jsonData = await response.json();
		//process elements: add to each element a chain of parents til they reach the root node
		const processedFunctions = processFunctionElements(jsonData.data);
		setFunctionOptions(processedFunctions);
		return jsonData
	}

	//async functions to wait for all the fetches to be over before setting the loading variable to true
	async function fetchWaiter() {
		setLoading(true)
		await Promise.all([fetchApplicationOptions(), fetchFunctionOptions()]);
		setLoading(false)
	}

	useEffect(() => {
		fetchWaiter()
	}, []);

	//default valus for form
	const defaultValues = {
		name: "",
		applications: [],
		selectedLowestLevelFunctions: [],
		function: undefined,
	};

	type FormFields = z.infer<typeof ApplicationAddFormSchema>;

	const { handleSubmit, reset, control, getValues, setValue, trigger } = useForm<FormFields>({
		mode: "onBlur",
		reValidateMode: "onBlur",
		resolver: zodResolver(ApplicationAddFormSchema),
		defaultValues: defaultValues,
	});

	//function to handle submit
	const onSubmit = (data: FormFields) => {
		const lowestLevelFunctionsIds = extract(selectedLowestLevelFunctions, "id")
		setLoading(true)
		fetch('/api/applications/addApplication', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(
				{
					"name": data.name,
					"functions": lowestLevelFunctionsIds
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
				if (data.code == 1) {
					router.push("../../applications?succ")
				}
			}).catch(() => setLoading(false));  //set loading to false if the result is an error

	};


	//Stepper definition
	const steps = ['Basic Information', 'Function Connections'];

	//function to handle the pressing of the next button
	const handleNext = () => {
		trigger().then(result => {
			(result ? setActiveStep((prevActiveStep) => prevActiveStep + 1) : null);
		});

	};

	//function to handle the pressing of the back button
	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	//function to close the function add dialog
	const handleCloseDialog = () => {
		setShowDialog(false)
		//llfids=lowest level fuctiotions ids
		//given a function, get all the children (lowest level functions) of it
		const llfids = getChildrenIds(getNodeById(tree[0], (getValues("function") as any).id))
		//from the array of ids it create an array of the elements having those ids
		const filteredDataPerFunction = matchFunctionsByFunctionId(functionOptions, llfids);
		//concat the already selected functions and the new ones
		const concatArray = selectedLowestLevelFunctions.concat(filteredDataPerFunction);
		//remove the repetition
		const result = concatArray.filter((elem, index, self) => {
			return index === self.findIndex((e) => (
				e.id === elem.id
			));
		});
		setSelectedLowestLevelFunctions(result);
	}

	//function to handle the pressing of the add function button
	const handleFunctionAdd = () => {
		setValue("function", undefined);
		setShowDialog(true)
	}

	//second page of the Stepper
	const secondPage = <>
		<IconButton	onClick={handleFunctionAdd} size="small" sx={{ml:0, mt: 3.8, mb: 2, mr: 4 }}
							>
			<AddSharpIcon fontSize="small" />
					<Typography sx={{ fontSize: 17 }}>Function</Typography>
			</IconButton>

		{/* Table of the selected functions */}
		<SelectedFunctionsList
			applications={selectedApplications}
			data={selectedLowestLevelFunctions}
			tree={tree}
			setTree={setTree}
			setData={setSelectedLowestLevelFunctions}
		/>

			<Grid container spacing={2} sx={{pl:4, pr:4, pb:4, pt:4}} >
				<Grid item xs={12} sm={6} sx={{textAlign:{sm: "right", xs:"center"}}}>
			
					<Button variant="outlined" onClick={() => handleBack()} sx={{p:1, width: { xs: '50%', sm: 'auto' }}}>
						Back
					</Button>
					</Grid>
				<Grid item xs={12} sm={6} sx={{textAlign:{sm: "left", xs:"center"}}}>

					<Button variant="contained" onClick={handleSubmit(onSubmit)} sx={{p:1, width: { xs: '50%', sm: 'auto' }}}>
						Add Application
					</Button>
				</Grid>
			</Grid>
	</>

	//first page of the Stepper
	const firstPage = <>
		<Grid container spacing={3}>
			<Grid item xs={12}>
				<Typography sx={{ mt: 3 }} variant="h6" component="div">
					Application Information
				</Typography>
			</Grid>

			{/* Input: Name */}
			<Grid item xs={12}  lg={6}>
				<FormInputText name="name" control={control} label="Name" rules={{ required: "This field is required" }} />
			</Grid>

			{/* Input: Applications */}
			<Grid item xs={12} lg={6}>
				<FormInputApplicationAdd
					control={control}
					name={"applications"}
					options={applicationOptions}
					label={"Copy Applications Functions"}
					onChange={() => setSelectedApplications(getValues("applications") as any)}
					selectedValues={selectedApplications}
					disabled={selectedLowestLevelFunctions.length != 0} />
			</Grid>
			<Grid item xs={12} sm={6} sx={{textAlign:{sm: "right", xs:"center"}}}>
			<Button variant="outlined" onClick={() => reset()} sx={{p:1, width: { xs: '50%', sm: 'auto' }}}>
							Reset Data
			</Button>
			</Grid>
			<Grid item xs={12} sm={6} sx={{textAlign:{sm: "left", xs:"center"}}}>
				<Button variant="contained" onClick={handleNext} sx={{p:1, width: { xs: '50%', sm: 'auto' }}}>
					Next
				</Button>
				</Grid>
		</Grid>
	</>


	return (
		<Box sx={{ flexGrow: 1, paddingLeft: 4, paddingRight: 4, marginTop: 0, marginBottom: 3 }} >

			{/* Add new function dialog */}
			<Dialog open={showDialog} onClose={() => setShowDialog(false)} PaperProps={{
				style: {
          minWidth: 100,
					width:'100%',
          maxWidth: 400, 
        },
			}}>
				<DialogContent>
					<FormGrid item xs={12}>
						<FormInputFunctionAutocomplete
							name="function"
							control={control}
							label="Add Function"
							options={functionOptions}
						/>
					</FormGrid>
				</DialogContent>
				<DialogActions>
					<Button sx={{ mr: 0, mb: 2 }} variant="outlined" onClick={() => setShowDialog(false)}>Cancel </Button>
					<Button sx={{ mr: 2, mb: 2 }} variant="contained" onClick={handleCloseDialog}>Confirm</Button>
				</DialogActions>
			</Dialog>

			<Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
				Add New Application
			</Typography>
			<Divider />

			{/* Stepper */}
			<Stepper sx={{ mt: 3 }} activeStep={activeStep} alternativeLabel>
				{steps.map((label) => {
					const stepProps: { completed?: boolean } = {};
					const labelProps: {
						optional?: React.ReactNode;
					} = {};
					return (
						<Step key={label} {...stepProps}>
							<StepLabel {...labelProps}>{label}</StepLabel>
						</Step>
					);
				})}
			</Stepper>


			{/* Loading component */}
			{loading ? ( // Check if data is loading
				<Box display="flex" alignItems="center" justifyContent="center" sx={{ mt: 5 }}>
					<CircularProgress /> {/* Loading spinner */}
				</Box>
			) : (
				<form autoComplete="off">
					{activeStep === 0 ? (
						firstPage
					) : (
						secondPage
					)}
				</form>
			)}
		</Box>

	);
}