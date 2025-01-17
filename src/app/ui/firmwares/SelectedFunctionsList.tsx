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
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, Grid, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { extract, matchFunctionsByFunctionId } from '@/utility/DataHelper';
import EditSharpIcon from '@mui/icons-material/EditSharp';
import OtherOptionsEdit from './OtherOptionsEdit';
import RestoreSharpIcon from '@mui/icons-material/RestoreSharp';
import dayjs from 'dayjs';
import { resetOtherOptions } from './FunctionsListEdit';
import { addOthersProperties } from '@/utility/FormsHelper';
import { processFunctionElements, buildTree, getParentNames } from '@/utility/TreeHelper';

//component that shows the list of functions selected in the process of adding a new firmware
export function SelectedFunctionsList({ firmwares, data, setData, tree, setTree }) {

	//Options to select
	const [statusOptions, setStatusOptions] = useState<any>([]);

	const [showEditDialog, setShowEditDialog] = useState(false);
	const [loading, setLoading] = useState(true); // Loading state

	const [objectToEdit, setObjectToEdit] = useState('');
	const [newObject, setNewObject] = useState('');

	const [anchorEditMenu, setAnchorEditMenu] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEditMenu);

	async function fetchStatusOptions() {
		const response = await fetch("/api/utils/status");
		const jsonData = await response.json();
		setStatusOptions(jsonData.data);
	}

	useEffect(() => {
		setLoading(true)
		prepareData();
		fetchStatusOptions();
	}, []);

	/* 
		This function is used to prepare the data to display in the functions table
		The first fetch get all the functions, the second get all the functions connected
		to a list of firmwares
	*/
	const prepareData = async () => {
		if (data.length == 0) {
			const response = await fetch("/api/functions/detailedlist");
			const jsonData = await response.json();
			//process elements: add to each element a chain of parents til they reach the root node
			const processedElements = processFunctionElements(jsonData.data);
			const firmwaresIds = extract(firmwares, "id")
			const response2 = await fetch('/api/functions/detailedListPerFirmwares', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(
					{
						"name": data.name,
						"firmwaresIds": firmwaresIds
					}),
			})
			const functions = await response2.json();
			//functions is a list of rows of LowestLevelFunctionStatus, I want that the id of each element if the functionId
			const functionsIds = extract(functions, "functionId")
			//extract the functions 
			const filteredData = matchFunctionsByFunctionId(processedElements, functionsIds);
			const functionsTree = buildTree(processedElements, "", true, -1);
			setTree(functionsTree)
			setData(addOthersProperties(filteredData))
		}
		setLoading(false)
	};

	//function to open the edit menu
	const handleClickEditMenu = (event, component) => {
		setObjectToEdit(component)
		setAnchorEditMenu(event.currentTarget);
	};

	//function to close the edit menu
	const handleCloseEditMenu = () => {
		setAnchorEditMenu(null);
	};

	//function to open the otherInformation edit dialog
	const handleOpenEditDialog = (event, component) => {
		setObjectToEdit(component);
		setShowEditDialog(true);
	};

	//function to reset all the other information of the connection between the given firmware and all the functions
	const resetData = (statusId: number) => {
		setData(resetOtherOptions(data, statusId))
		handleCloseEditMenu();
	}

	//function to close the otherInformation edit dialog
	const handleCloseEditDialog = () => {
		setShowEditDialog(false)
	}

	//function to handle the removal of a function from the list (X button)
	const handleRemove = async (id) => {
		setData(data.filter((el) => el.id !== id));
	}

	return (
		<div style={{ minHeight: '300px', maxHeight: '400px', overflow: 'auto' }}>

			{/* Edit other information dialog */}
			<Dialog open={showEditDialog} onClose={() => setShowEditDialog(false)} PaperProps={{
				style: {
					minWidth: 400,
					maxWidth: 'none', // Set your desired width here
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

			{/* Functions Table */}
			<TableContainer component={Paper} sx={{ paddingLeft: 3, paddingRight: 3, mt: 2 }}>
				<Table sx={{ minWidth: 300, marginBottom: 3 }} size="small" aria-label="a dense table">
					<TableHead>
						<TableRow>
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
							<TableCell sx={{ fontSize: 15 }} align="left"><b>Actions</b></TableCell>
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
						) : data.map((row, index) => (
							<TableRow
								key={row.id}
								sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
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
										{
											(row.lowestLevel && row.functionLevel.name == "Core Level" ? "-" : getParentNames(row)[2])
										}</Typography>
								</TableCell>

								{/* Function's name */}
								<TableCell component="th" scope="row">
									<Typography sx={{ fontSize: 13 }}><b>{row.name}</b></Typography>
								</TableCell>
								<TableCell>
									{/* Status */}
									<Typography sx={{ fontSize: 12 }}>Status: <b>{statusOptions.find(option => option.id === row.status)?.name}</b></Typography>

									{/* Effort */}
									{row.effort != "" && (
										<Typography sx={{ fontSize: 12 }}>Effort: <b>{row.effort}</b></Typography>
									)}

									{/* Start Date */}
									{row.startDate != null && (
										<Typography sx={{ fontSize: 12 }}>Start: <b>{row.startDate.substring(0, 10)}</b></Typography>
									)}

									{/* End Date */}
									{row.endDate != null && (
										<Typography sx={{ fontSize: 12 }}>End: <b>{row.endDate.substring(0, 10)}</b></Typography>
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
										<Grid item xs={6}>
											<IconButton onClick={(event) => handleRemove(row.id)} size='small'>
												<ClearSharp fontSize='small' />
											</IconButton>
										</Grid>
									</Grid>
								</TableCell>

							</TableRow>
						))
						}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
}

