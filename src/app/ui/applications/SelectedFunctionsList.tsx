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
import { CircularProgress, IconButton, Typography } from '@mui/material';
import { extract, filterFunctionsByApplicationId } from '@/utility/DataHelper';
import { buildTree, getParentNames, processFunctionElements } from '@/utility/TreeHelper';

//component that shows the list of functions selected in the process of adding a new application
export function SelectedFunctionsList({ applications, data, setData, tree, setTree }) {
	const [loading, setLoading] = useState(true); // Loading state

	useEffect(() => {
		setLoading(true)
		prepareData();
	}, []);

	/* 
		This function is used to prepare the data to display in the functions table
	*/
	const prepareData = async () => {
		if (data.length == 0) {
			const response = await fetch("/api/functions/detailedlist");
			const jsonData = await response.json();
			//process elements: add to each element a chain of parents til they reach the root node
			const processedElements = processFunctionElements(jsonData.data);
			const applicationsIds = extract(applications, "id")

			//extract the functions only for the application selected
			const filteredDataPerApplication = filterFunctionsByApplicationId(processedElements, applicationsIds);
			const functionsTree = buildTree(processedElements, "prova", true, -1);
			setTree(functionsTree)
			const applicationsIdsSet = new Set(filteredDataPerApplication);
			setData(filteredDataPerApplication)
		}
		setLoading(false)
	};

	//function to handle the removal of a function from the list (X button)
	const handleRemove = async (id) => {
		//remove llf from the selected list
		setData(data.filter((el) => el.id !== id));
	}

	return (
		<div style={{ minHeight: '300px', maxHeight: '400px', overflow: 'auto' }}>

			{/* Functions Table */}
			<TableContainer component={Paper} sx={{ paddingLeft: 3, paddingRight: 3, mt: 2 }}>
				<Table sx={{ minWidth: 300, marginBottom: 3 }} size="small" aria-label="a dense table">
					<TableHead>
						<TableRow>
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
								<TableCell colSpan={6} align="center">
									<CircularProgress /> {/* Loading spinner */}
									<Typography variant="body2" sx={{ mt: 2 }}>Loading data...</Typography>
								</TableCell>
							</TableRow>
						) : data.map((row) => (
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

								{/* remove button */}
								<TableCell>
									<IconButton onClick={(event) => handleRemove(row.id)} size='small'>
										<ClearSharp fontSize='small' />
									</IconButton>
								</TableCell>

							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
}

