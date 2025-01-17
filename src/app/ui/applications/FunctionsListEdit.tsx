import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ClearSharp from '@mui/icons-material/ClearSharp';
import { useState, useEffect } from 'react';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, Divider, IconButton, Typography } from '@mui/material';
import { extract, filterFunctionsByApplicationId, getChildrenIds, getNodeById, matchFunctionsByFunctionId } from '@/utility/DataHelper';
import { FormGrid } from '@/styles/style';
import { FormInputFunctionAutocomplete } from '../form/FormInputAutocomplete';
import { ApplicationAddFormSchema } from '@/utility/ZodHelper';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FunctionElement } from '@/utility/Interfaces';
import { processFunctionElements, buildTree, getParentNames } from '@/utility/TreeHelper';

//component that shows the functions connected to an application selected with edit
export function FunctionsListEdit({ application, handleCloseFromParentDialog }) {
	const [tree, setTree] = useState<FunctionElement[]>([]);
	const [showDialog, setShowDialog] = useState(false);
	const [data, setData] = useState<FunctionElement[]>([]);

	//Options to select
	const [functionOptions, setFunctionOptions] = useState<FunctionElement[]>([]);

	const [loading, setLoading] = useState(false); // Loading state


	useEffect(() => {
		prepareData();
	}, []);

	//default form's values
	const defaultValues = {
		name: "",
		applications: [],
		selectedLowestLevelFunctions: []
	};

	type FormFields = z.infer<typeof ApplicationAddFormSchema>;

	const { control, getValues, setValue } = useForm<FormFields>({
		mode: "onBlur",
		reValidateMode: "onBlur",
		resolver: zodResolver(ApplicationAddFormSchema),
		defaultValues: defaultValues,
	});


	//function to handle pressing application edit
	const editApplication = () => {
		const lowestLevelFunctionsIds = extract(data, "id")
		setLoading(true)
		fetch('/api/applications/editApplicationFunctions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(
				{
					"id": application.id,
					"functions": (lowestLevelFunctionsIds != null ? lowestLevelFunctionsIds : [])
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
					handleCloseFromParentDialog();
				}
			}).catch(() => setLoading(false));  //set loading to false if the result is an error    
	};

	/* 
		This function is used to prepare the data to display in the functions table
	*/
	const prepareData = async () => {
		setLoading(true)
		const response = await fetch("/api/functions/detailedlist");
		const jsonData = await response.json();
		//process elements: add to each element a chain of parents til they reach the root node
		const processedElements = processFunctionElements(jsonData.data);
		setFunctionOptions(processedElements)

		//extract the functions only for the application selected
		const filteredDataPerApplication = filterFunctionsByApplicationId(processedElements, [application.id]);
		const functionsTree = buildTree(processedElements, "prova", true, -1);
		setTree(functionsTree)
		setData(filteredDataPerApplication)
		setLoading(false)
	};

	//function to handle the removal of a function from the list (X button)
	const handleRemove = async (id) => {
		//remove llf from the selected list
		setData(data.filter((el) => el.id !== id));
	}

	//function to handle the pressing of the add function button
	const handleFunctionAdd = () => {
		setValue("function", undefined);
		setShowDialog(true)
	}

	//function to close the function add dialog
	const handleCloseDialog = () => {
		setShowDialog(false)
		//llfids=lowest level fuctiotions ids
		//given a function, get all the children (lowest level functions) of it
		const llfids = getChildrenIds(getNodeById(tree[0], (getValues("function") as any).id))
		//from the array of ids it create an array of the elements having those ids
		const filteredDataPerFunction = matchFunctionsByFunctionId(functionOptions, llfids);
		//concat the already selected functions and the new ones
		const concatArray = data.concat(filteredDataPerFunction);
		//remove the repetition
		const result = concatArray.filter((elem, index, self) => {
			return index === self.findIndex((e) => (
				e.id === elem.id
			));
		});
		setData(result);
	}

	return (
		<>
			{/* Add new function dialog */}
			<Dialog open={showDialog} onClose={() => setShowDialog(false)} PaperProps={{
				style: {
					minWidth: 400,
					maxWidth: 'none', // Set your desired width here
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
			<Typography sx={{ mt: 1, mb: 1, ml: 3 }} variant="h6" component="div">
				Application Name: <b>{application.name}</b>
			</Typography>
			<Divider />

			{/* Functions Table */}
			<div style={{ maxHeight: "calc(100vh - 270px)", overflow: "auto", marginBottom: 16, marginTop: 20 }}>
				<TableContainer component={Paper} sx={{ paddingLeft: 3, paddingRight: 3, mt: 0 }}>
					<Table sx={{ minWidth: 300, marginBottom: 3 }} size="small" aria-label="a dense table">
						<TableHead>
							<TableRow style={{ position: 'sticky', top: 0, background: 'white' }}>
								{/* Columns names */}
								<TableCell sx={{ fontSize: 15 }} align="left"><b>Strategic Layer</b> </TableCell>
								<TableCell sx={{ fontSize: 15 }} align="left"><b>Operational Layer</b></TableCell>
								<TableCell sx={{ fontSize: 15 }} align="left"><b>Framework Layer</b></TableCell>
								<TableCell sx={{ fontSize: 15 }} align="left"><b>Name</b></TableCell>
								<TableCell></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>

							{/* Loading component */}
							{loading ? ( // Check if data is loading
								<TableRow>
									<TableCell colSpan={5} align="center">
										<CircularProgress /> {/* Loading spinner */}
										<Typography variant="body2" sx={{ mt: 2 }}>Loading data...</Typography>
									</TableCell>
								</TableRow>
							) : data.map((row) => (
								<TableRow
									key={row.id}
									sx={{ position: 'sticky', top: 0, background: 'white' }}
								>
									{/* Behaviour Level */}
									<TableCell component="th" scope="row">
										<Typography sx={{ fontSize: 13 }}>{getParentNames(row)[0]}</Typography>
									</TableCell>

									{/* Function Level */}
									<TableCell component="th" scope="row">
										<Typography sx={{ fontSize: 13 }}>{getParentNames(row)[1]} </Typography>
									</TableCell>

									{/* Core Level */}
									<TableCell component="th" scope="row">
										<Typography sx={{ fontSize: 13 }}>
											{(row.lowestLevel && row.functionLevel.name == "Core Level" ? "-" : getParentNames(row)[2])}</Typography>
									</TableCell>

									{/* Function's name */}
									<TableCell component="th" scope="row">
										<Typography sx={{ fontSize: 13 }}><b>{row.name}</b></Typography>
									</TableCell>

									{/* remove button */}
									<TableCell>
										<IconButton onClick={() => handleRemove(row.id)} size='small'>
											<ClearSharp fontSize='small' />
										</IconButton>
									</TableCell>

								</TableRow>
							))
							}
						</TableBody>
					</Table>
				</TableContainer>

			</div>
			<div style={{ display: "flex", justifyContent: "center" }}>
				<Button sx={{ mr: 2 }} variant="outlined" onClick={handleFunctionAdd} disabled={loading} startIcon={<AddSharpIcon />}>
					Function
				</Button>
				<Button variant="contained" onClick={editApplication}>
					Edit Application
				</Button>

			</div>

		</>
	);
}

