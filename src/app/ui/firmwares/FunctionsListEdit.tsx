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
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, Divider, Grid, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { extract, getChildrenIds, getNodeById, matchFunctionsByFunctionId, extractOtherInformation, matchFunctionsByFunctionId_2, changeIdToFunctionId } from '@/utility/DataHelper';
import { FormGrid } from '@/styles/style';
import { FormInputFunctionAutocomplete } from '../form/FormInputAutocomplete';
import { ApplicationAddFormSchema, FirmwareAddFormSchema } from '@/utility/ZodHelper';
import { zodResolver } from '@hookform/resolvers/zod';
import RestoreSharpIcon from '@mui/icons-material/RestoreSharp';
import { useForm } from 'react-hook-form';
import EditSharpIcon from '@mui/icons-material/EditSharp';
import { z } from 'zod';
import { Functions } from '@mui/icons-material';
import OtherOptionsEdit from './OtherOptionsEdit';
import { addOthersProperties } from '@/utility/FormsHelper';
import { FunctionElement } from '@/utility/Interfaces';
import { processFunctionElements, buildTree, getParentNames } from '@/utility/TreeHelper';

export const resetOtherOptions = (elements, statusId?: number) => {
	if (statusId == null) {
		statusId = 1
	}
	return elements.map((element) => ({
		...element,
		status: statusId,
		effort: "",
		startDate: null,
		endDate: null,
	}));
}

//component that shows the functions connected to a firmware selected with the edit purpose
export function FunctionsListEdit({ firmware, handleCloseFromParentDialog }) {
	const [tree, setTree] = useState<FunctionElement[]>([]);
	const [showDialog, setShowDialog] = useState(false);
	const [showEditDialog, setShowEditDialog] = useState(false);
	const [data, setData] = useState<FunctionElement[]>([]);

	//Options to select
	const [statusOptions, setStatusOptions] = useState<any[]>([]);
	const [functionOptions, setFunctionOptions] = useState<FunctionElement[]>([]);

	const [objectToEdit, setObjectToEdit] = useState('');
	const [newObject, setNewObject] = useState('');

	const [loading, setLoading] = useState(false); // Loading state

	const [anchorEditMenu, setAnchorEditMenu] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEditMenu);

	useEffect(() => {
		setLoading(true)
		fetchStatusOptions();
		prepareData();
	}, []);

	async function fetchStatusOptions() {
		const response = await fetch("/api/utils/status");
		const jsonData = await response.json();
		setStatusOptions(jsonData.data);
	}

	//default form's values
	const defaultValues = {
		partNumber: "",
		versionString: "",
		firmwares: [],
		componentType: -1,
		product: -1,
		customer: -1,
		status: -1,
	};

	type FormFields = z.infer<typeof FirmwareAddFormSchema>;

	const { control, getValues, setValue } = useForm<FormFields>({
		mode: "onBlur",
		reValidateMode: "onBlur",
		resolver: zodResolver(ApplicationAddFormSchema),
		defaultValues: defaultValues,
	});


	//function to handle pressing firmware edit
	const editFirmware = () => {
		const lowestLevelFunctionsIds = extractOtherInformation(data, "id")
		setLoading(true)
		fetch('/api/firmwares/editFirmwareFunctions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(
				{
					"id": firmware.id,
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
				if (data.code == 1) {
					handleCloseFromParentDialog();
				}
			}).catch(() => setLoading(false))
	};

	/* 
		This function is used to prepare the data to display in the functions table
		The first fetch get all the functions, the second get all the functions connected
		to a list of firmwares
	*/
	const prepareData = async () => {
		const response = await fetch("/api/functions/detailedlist");
		const jsonData = await response.json();
		//process elements: add to each element a chain of parents til they reach the root node
		const processedElements = processFunctionElements(jsonData.data);
		setFunctionOptions(processedElements)
		const firmwaresIds = extract([firmware], "id")
		const response2 = await fetch('/api/functions/detailedListPerFirmwares', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(
				{
					"firmwaresIds": firmwaresIds
				}),
		})
		const functions = await response2.json();
		//functions is a list of rows of LowestLevelFunctionStatus, I want that the id of each element if the functionId
		const functionsIds = changeIdToFunctionId(functions)
		//extract the functions 
		const filteredData = matchFunctionsByFunctionId_2(processedElements, functionsIds);
		const functionsTree = buildTree(processedElements, "", true, -1);
		setTree(functionsTree)
		setData(addOthersProperties(filteredData))
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

	//function to handle the otherInformation Data (information about the connection
	//between firmware and function: effort, startDate, endDate, and status)
	const resetData = (statusId: number) => {
		setData(resetOtherOptions(data, statusId))
		handleCloseEditMenu();
	}

	//function to close the otherInformation edit dialog
	const handleCloseEditDialog = () => {
		setShowEditDialog(false)
	}

	//function to open the otherInformation edit dialog
	const handleOpenEditDialog = (event, component) => {
		setObjectToEdit(component);
		setShowEditDialog(true);
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
		const concatArray = data.concat(addOthersProperties(filteredDataPerFunction));
		//remove the repetition
		const result = concatArray.filter((elem, index, self) => {
			return index === self.findIndex((e) => (
				e.id === elem.id
			));
		});
		setData(result);
	}

	//function to open the edit menu
	const handleClickEditMenu = (event, component) => {
		setObjectToEdit(component)
		setAnchorEditMenu(event.currentTarget);
	};

	//function to close the edit menu
	const handleCloseEditMenu = () => {
		setAnchorEditMenu(null);
	};

	return (
		<>
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

			{/* Edit other information dialog */}
			<Dialog open={showEditDialog} onClose={() => setShowEditDialog(false)} PaperProps={{
				style: {
          minWidth: 100,
					width:'100%',
          maxWidth: 1000, 
        },
			}}>
				<DialogContent>
					<OtherOptionsEdit
						elementToEdit={objectToEdit}
						handleCloseFromParentDialog={handleCloseEditDialog}
						statusOptions={statusOptions}
						setNewObject={setNewObject}
					/>
				</DialogContent>
				<DialogActions>
					<Button sx={{ mr: 7, mb: 2 }} variant="outlined" onClick={() => setShowEditDialog(false)}>Cancel </Button>
					{/* <Button sx={{mr:2, mb: 2}} variant="contained" onClick={handleCloseEditDialog}>Confirm</Button> */}
				</DialogActions>
			</Dialog>

			{/* Edit Menu */}
			<Menu
				id="basic-menu"
				anchorEl={anchorEditMenu}
				open={open}
				onClose={handleCloseEditMenu}
				MenuListProps={{
					'aria-labelledby': 'basic-button',
				}}
			>
				<MenuItem sx={{ fontSize: 15 }} onClick={() => resetData(1)}>Set all to "Not Started"</MenuItem>
				<MenuItem sx={{ fontSize: 15 }} onClick={() => resetData(6)}>Set all to "Finished"</MenuItem>
			</Menu>


			<Typography sx={{ mt: 1, mb: 1, ml: 3 }} variant="h6" component="div">
				Firmware: <b>{firmware.partNumber + " || " + firmware.versionString}</b>
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
								<TableCell sx={{ fontSize: 15, minWidth: 200 }} align="left"><b>Others</b>
									<IconButton onClick={() => handleClickEditMenu}>
										<RestoreSharpIcon fontSize='small' />
									</IconButton>
								</TableCell>
								<TableCell></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>

							{/* Loading component */}
							{loading ? ( // Check if data is loading
								<TableRow>
									<TableCell colSpan={6} align="center">
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

									<TableCell>
										{/* Status */}
										<Typography sx={{ fontSize: 12 }}>Status: <b>{statusOptions.find(option => option.id === row.status)?.name}</b></Typography>

										{/* Effort */}
										{row.effort?.toString() != "" && (
											<Typography sx={{ fontSize: 12 }}>Effort: <b>{row.effort}</b></Typography>
										)}

										{/* Start Date */}
										{row.startDate != null && (
											<Typography sx={{ fontSize: 12 }}>Start: <b>{row.startDate.toString().substring(0, 10)}</b></Typography>
										)}

										{/* End Date */}
										{row.endDate != null && (
											<Typography sx={{ fontSize: 12 }}>End: <b>{row.endDate.toString().substring(0, 10)}</b></Typography>
										)}
									</TableCell>
									<TableCell>
										<Grid container spacing={0}>

											{/* edit other information button */}
											<Grid item xs={6}>
												<IconButton onClick={(event) => handleOpenEditDialog(event, row)}>
													<EditSharpIcon fontSize='small' />
												</IconButton>
											</Grid>

											{/* remove button */}
											<Grid item xs={6} sx={{paddingLeft: 1.5}}>
												<IconButton onClick={(event) => handleRemove(row.id)} size='small'>
													<ClearSharp fontSize='small' />
												</IconButton>
											</Grid>
										</Grid>
									</TableCell>

								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>

			</div>

			<Grid container spacing={3}>
				<Grid item xs={12} sm={6} sx={{textAlign:{sm: "right", xs:"center"}}}>
					<Button variant="outlined" onClick={handleFunctionAdd} sx={{p:1, width: { xs: '50%', sm: 'auto' }}} disabled={loading} startIcon={<AddSharpIcon />}>
						Function
					</Button>
				</Grid>
				<Grid item xs={12} sm={6} sx={{textAlign:{sm: "left", xs:"center"}}}>
					<Button variant="contained" onClick={editFirmware} sx={{p:1, width: { xs: '50%', sm: 'auto' }}}>
						Edit Firmware
					</Button>
				</Grid>
			</Grid>

		</>
	);
}
