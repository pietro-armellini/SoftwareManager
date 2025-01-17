import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import InfoSharpIcon from '@mui/icons-material/InfoSharp';
import { useState, useEffect } from 'react';
import { CircularProgress, ClickAwayListener, Divider, IconButton, List, ListItem, ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';

//Component showing detailed data about a lowestLevelFunction: basic information and firmware and application connected
export default function FunctionInfo({ id }) {
	const [data, setData] = useState<any>([]);

	//state variable for the state of the tooltip showing other information about the status of the function in a given firmware through a tooltip
	const [open, setOpen] = React.useState(false);

	const [loading, setLoading] = useState(true); // Loading state

	async function fetchData() {
		setLoading(true);
		const response = await fetch("/api/functions/" + id);
		const jsonData = await response.json();
		setData(jsonData.data);
		setLoading(false)
	}

	useEffect(() => {
		fetchData();
	}, []);

	//handle close of the other information tooltip
	const handleTooltipClose = () => {
		setOpen(false);
	};

	//handle open of the other information tooltip
	const handleTooltipOpen = () => {
		setOpen(true);
	};



	return (
		<Box sx={{ flexGrow: 1, paddingLeft: 3, paddingRight: 3, marginTop: 0, marginBottom: 3 }} >
			<Grid container>
				<Grid item xs={10}>
					<Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
						Lowest Level Function Information
					</Typography>
				</Grid>
				<Grid item xs={2}>
					{loading ? ( // Check if data is loading
						<Box display='flex'
							justifyContent='right'
							sx={{ mt: 3 }}>
							<CircularProgress size="2rem" /> {/* Loading spinner */}
						</Box>
					) : null}
				</Grid>
			</Grid>
			<Divider />
			<Grid container>
				<Grid item xs={8}>
					<List dense>
						<ListItem >
							<Grid container>
								<Grid item xs={12}>
									<ListItemText secondary="Name" primary={<Typography sx={{ fontSize: 16 }}>{data.name}</Typography>}></ListItemText>
								</Grid>
								<Grid item xs={12}>
									<ListItemText secondary="Function Level" primary={<Typography sx={{ fontSize: 16 }}>{data.functionLevel?.name}</Typography>}></ListItemText>
								</Grid>
							</Grid>
						</ListItem>
					</List>
				</Grid>
				<Grid item xs={4}>

					{/* Firmwares Table */}
					<TableContainer>
						<Typography sx={{ mt: 2, mb: 2 }} variant="h6" component="div">
							Applications
						</Typography>
						<Table sx={{ marginBottom: 3 }} size="small" aria-label="a dense table">
							<TableHead>
								<TableRow>
									<TableCell sx={{ fontSize: 16 }}><b>Name</b></TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{data.functionApplication?.map((row) => (
									<TableRow
										key={row.id}
										sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
									>
										<TableCell component="th" scope="row">
											<Typography>{row.application.name}</Typography>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</Grid>
			</Grid>


			{/* Firmwares Table */}
			<TableContainer>
				<Typography sx={{ mt: 0, mb: 2 }} variant="h6" component="div">
					Firmwares
				</Typography>
				<Table sx={{ minWidth: 650, marginBottom: 3 }} size="small" aria-label="a dense table">
					<TableHead>
						<TableRow>
							<TableCell sx={{ fontSize: 16 }}><b>Part Number</b></TableCell>
							<TableCell sx={{ fontSize: 16 }} align="left"><b>Version String</b></TableCell>
							<TableCell sx={{ fontSize: 16 }} align="left"><b>Component Type</b></TableCell>
							<TableCell sx={{ fontSize: 16 }} align="left"><b>Status</b></TableCell>
							<TableCell sx={{ fontSize: 16 }} align="left"><b>Product</b></TableCell>
							<TableCell sx={{ fontSize: 16 }} align="left"><b>Custumer</b></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data.lowestLevelFunctionStatus?.map((row) => (
							<TableRow
								key={row.id}
								sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
							>
								<TableCell component="th" scope="row">
									<Typography>{row.firmware.partNumber}</Typography>
								</TableCell>
								<TableCell component="th" scope="row">
									<Typography>{row.firmware.versionString}</Typography>
								</TableCell>
								<TableCell component="th" scope="row">
									<Typography>{row.firmware.componentType.name}</Typography>
								</TableCell>
								<TableCell component="th" scope="row">
									<Typography>
										{row.functionStatus.name}
										{(row.effort != null || row.startDate != null || row.startDate != null) ? (
											//Tooltip to see data related to the firmware connection
											<ClickAwayListener onClickAway={handleTooltipClose}>
												<Tooltip
													PopperProps={{
														disablePortal: true,
													}}
													onClose={handleTooltipClose}
													open={open}
													disableFocusListener
													disableHoverListener
													disableTouchListener
													title={
														<>
															{row.effort != null && (
																<Typography sx={{ fontSize: 12 }}>Effort: <b>{row.effort}</b></Typography>
															)}

															{row.startDate != null && (
																<Typography sx={{ fontSize: 12 }}>Start: <b>{row.startDate.substring(0, 10)}</b></Typography>
															)}

															{row.endDate != null && (
																<Typography sx={{ fontSize: 12 }}>End: <b>{row.endDate.substring(0, 10)}</b></Typography>
															)}
														</>
													}
												>
													<IconButton onClick={handleTooltipOpen} size='small'>
														<InfoSharpIcon fontSize='small' />
													</IconButton>
												</Tooltip>
											</ClickAwayListener>
										) : null}
									</Typography>
								</TableCell>
								<TableCell component="th" scope="row">
									<Typography>{row.firmware.product.name}</Typography>
								</TableCell>
								<TableCell component="th" scope="row">
									<Typography>{row.firmware.customer.name}</Typography>
								</TableCell>

							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
}