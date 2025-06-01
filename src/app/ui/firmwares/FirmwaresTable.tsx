import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from "@mui/material/TextField"
import Box from "@mui/material/Box"
import AddSharpIcon from '@mui/icons-material/AddSharp';
import EditSharpIcon from '@mui/icons-material/EditSharp';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import { useState, useEffect } from 'react';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Menu, MenuItem, Snackbar, SnackbarContent, Typography } from '@mui/material';
import { lightBlue, green, red } from '@mui/material/colors';
import { useRouter, useSearchParams } from 'next/navigation';
import FirmwareEdit from './FirmwareEdit';
import { FunctionsListEdit } from './FunctionsListEdit';

//Component to view firmwares
export default function FirmwaresTable() {
  const [data, setData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true); // Loading state
  const [deletedSnackbar, setDeletedSnackbar] = useState(false);
  const [failedDeletedSnackbar, setFailedDeletedSnackbar] = useState(false);
  const [addedSnackbar, setAddedSnackbar] = useState(false);
	//state variable to set the object to delete when pressing the delete icon
  const [deletedName, setDeletedName] = useState('');
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
	//state variable to set the just deleted object
  const [objectToDelete, setObjectToDelete] = useState<any>(null);
	//state variable to set the object to edit
  const [objectToEdit, setObjectToEdit] = useState('');
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showEditFunctionDialog, setShowEditFunctionsDialog] = useState(false);
  const [editedSnackbar, setEditedSnackbar] = useState(false);
  const [anchorEditMenu, setAnchorEditMenu] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEditMenu);

  const router = useRouter();
  const searchParams = useSearchParams()
  
  useEffect(() => {
		setLoading(true); // Set loading to true before fetching
    fetchData();
		//if param succ is true it means FunctionAdd component just pushed to the table after successfully adding a new entry
    if (searchParams.has('succ')){
      router.push("/firmwares");
      setAddedSnackbar(true);
    }
  }, []);

  const fetchData = async () => {
    const response = await fetch("/api/firmwares/detailedlist");
    const jsonData = await response.json();
    setData(jsonData.data);
        setLoading(false); // Set loading to false after fetching
  };

	//filtered data based on the seach filter
  const filteredData = data.filter((row) => {
    return row.partNumber.toLowerCase().includes(searchQuery.toLowerCase());
  });

	//function to handle the search change
  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

	//function called when pressing on delete icon
  const handleDeleteConfirmation = async () => {
    await fetch('/api/firmwares/removeFirmware', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "id": String(objectToDelete?.id) }),
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Network response was not successful.');
      }
    })
    .then(data => {
      setDeletedName(objectToDelete.partNumber);
			//code == 1 => success
      if(data.code == 1){
        setDeletedSnackbar(true);
        fetchData();
        handleCloseConfirmationDialog();
        setObjectToDelete(null);
      }
      else{
        setFailedDeletedSnackbar(true);
      }
    });  
  };

	//function to close the edit base data dialog
  const closeEditDialog = () => {
    setShowEditDialog(false);
  }

	//function to open the edit base data dialog
  const handleOpenEditDialog = () => {
    setShowEditDialog(true); 
    handleCloseEditMenu()
  };

	//function used by the edit base data dialog to close itself when the editing went successfully
	const handleCloseEditDialogFromChild = (element, type) => {
    closeEditDialog();
    setEditedSnackbar(true);
    fetchData();
  }

	//function to close the edit functions connections dialog
  const closeEditFunctionsDialog = () => {
    setShowEditFunctionsDialog(false);
  }

	//function to open the edit functions connections dialog
  const handleOpenEditFunctionsDialog = () => {
    setShowEditFunctionsDialog(true); 
    handleCloseEditMenu();
  };

	//function used by the edit functions connecctions dialog to close itself when the editing went successfully
  const handleCloseEditFunctionsDialogFromChild = (element, type) => {
    closeEditFunctionsDialog();
    setEditedSnackbar(true); 
  }

	//function to open the delete confirmation dialog
	const handleOpenConfirmationDialog = (component) => {
    setObjectToDelete(component);
    setShowConfirmationDialog(true);
  };

	//function to close the delete confirmation dialog
  const handleCloseConfirmationDialog = () => {
    setShowConfirmationDialog(false);
    setObjectToDelete(null);
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

  return (
    <Box>

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
        <MenuItem sx={{fontSize:15}} onClick={handleOpenEditDialog}>Edit Firmware</MenuItem>
        <MenuItem sx={{fontSize:15}} onClick={handleOpenEditFunctionsDialog}>Edit Connected Functions</MenuItem>
      </Menu>

			{/* Deleted Snackbar */}
      <Snackbar
        open={deletedSnackbar}
        autoHideDuration={3000}
        onClose={()=>{setDeletedSnackbar(false)}}
      >
        <SnackbarContent
          sx={{backgroundColor: lightBlue[600]}}
          message={`Firmware "${deletedName}" deleted successfully`}
        />
      </Snackbar>

			{/* Delete Failed Snackbar */}
      <Snackbar
        open={failedDeletedSnackbar}
        autoHideDuration={3000}
        onClose={()=>{setFailedDeletedSnackbar(false)}}
      >
        <SnackbarContent
          sx={{backgroundColor: red[600]}}
          message={`Firmware "${deletedName}" couldn't be successfully deleted`}
        />
      </Snackbar>

			{/* Added snackbar */}
      <Snackbar
        open={addedSnackbar}
        autoHideDuration={3000}
        onClose={()=>{setAddedSnackbar(false)}}
      >
        <SnackbarContent
          sx={{backgroundColor: green[600]}}
          message={`Firmware Added successfully`}
        />
      </Snackbar>

			{/* Edited Snackbar */}
      <Snackbar
        open={editedSnackbar}
        autoHideDuration={3000}
        onClose={()=>{setEditedSnackbar(false)}}
      > 
        <SnackbarContent
          sx={{backgroundColor: green[600]}}
          message={`Firmware Edited successfully`}
        />
      </Snackbar>

			{/* Delete Dialog */}
      <Dialog open={showConfirmationDialog} onClose={handleCloseConfirmationDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the firmware "{objectToDelete && objectToDelete.partNumber}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmationDialog}>Cancel</Button>
          <Button color="error" onClick={handleDeleteConfirmation} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

			{/* Edit base data dialog */}
      <Dialog open={showEditDialog} onClose={closeEditDialog} PaperProps={{
        style: {
          minWidth: 100,
					width:'100%',
          maxWidth: 1000, 
        },
      }}>
        <DialogContent>
          <FirmwareEdit elementToEdit={objectToEdit} handleCloseFromParentDialog={handleCloseEditDialogFromChild}/>     
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>

			{/* Edit functions connections dialog */}
      <Dialog open={showEditFunctionDialog} onClose={closeEditFunctionsDialog} fullWidth PaperProps={{
        style: {
          minWidth: 1000,
          maxWidth: 'none', // Set your desired width here
        },
      }}>
        <DialogContent>
          <FunctionsListEdit firmware={objectToEdit} handleCloseFromParentDialog={handleCloseEditFunctionsDialogFromChild}/>     
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditFunctionsDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>

		<Grid container wrap="nowrap" sx={{ flexWrap: { xs: "wrap", sm: "nowrap" } }}>
			
      <Grid item xs>
                <Typography	sx={{ mt: 4, mb: 2, ml: 4 }} variant="h6"	component="div">
                  Firmwares
                </Typography>
              </Grid>
      
      <Grid item sx={{ textAlign: "right"}}				>
					<IconButton	href="/products/addproduct"	size="small" sx={{ml:4, mt: 3.8, mb: 2, mr: 4 }}
					>
						<AddSharpIcon fontSize="small" />
						<Typography sx={{ fontSize: 17 }}>New Firmware</Typography>
					</IconButton>
				</Grid>
            </Grid>
      

			{/* Search filter */}
      <Box sx={{ marginRight: 4, marginLeft: 4, marginTop:2}}>
        <TextField
          label="Search Firmware"
          variant="standard"
          value={searchQuery}
          onChange={handleSearchQueryChange}
          fullWidth
        />
      </Box>

			{/* Main Table */}
      <TableContainer component={Paper} sx={{paddingLeft:3, paddingRight:3, mt:2}}>
        <Table sx={{ marginBottom:3}} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>

							{/* Columns names */}
              <TableCell sx={{ fontSize: 15}}><b>Part Number </b></TableCell>
              <TableCell sx={{ fontSize: 15}}><b>Version String</b></TableCell>
              <TableCell sx={{ fontSize: 15}}><b>Component Type</b></TableCell>
              <TableCell sx={{ fontSize: 15}}><b>Customer</b></TableCell>
              <TableCell sx={{ fontSize: 15}}><b>Product</b></TableCell>
              <TableCell sx={{ fontSize: 15}} align="right"><b>Actions</b></TableCell>

            </TableRow>
          </TableHead>
          <TableBody>

					{/* Loading component */}
          {loading ? ( // Check if data is loading
							//Conditional rendering for loading state variable
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress /> {/* Loading spinner */}
                    <Typography variant="body2" sx={{ mt: 2 }}>Loading data...</Typography>
                    </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? ( // Check if data is empty
							//When there are no data to display
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2">No firmware available</Typography>
                </TableCell>
              </TableRow>
            ) : (filteredData.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                                    <Typography
                                      sx={{
                                        fontSize: 13,
                                        wordBreak: 'break-word',   // Forza il testo a andare a capo anche senza spazi
                                        overflow: 'hidden',
                                        whiteSpace: 'normal'       // Permette al testo di andare a capo
                                      }}
                                    >
                                      {row.partNumber}
                                    </Typography>
                </TableCell>
                <TableCell component="th" scope="row">
                                    <Typography
                                      sx={{
                                        fontSize: 13,
                                        wordBreak: 'break-word',   // Forza il testo a andare a capo anche senza spazi
                                        overflow: 'hidden',
                                        whiteSpace: 'normal'       // Permette al testo di andare a capo
                                      }}
                                    >
                                      {row.versionString}
                                    </Typography>
								</TableCell>
                <TableCell component="th" scope="row">
                                    <Typography
                                      sx={{
                                        fontSize: 13,
                                        wordBreak: 'break-word',   // Forza il testo a andare a capo anche senza spazi
                                        overflow: 'hidden',
                                        whiteSpace: 'normal'       // Permette al testo di andare a capo
                                      }}
                                    >
                                      {row.componentType.name}
                                    </Typography>
                </TableCell>
                <TableCell component="th" scope="row">
                                    <Typography
                                      sx={{
                                        fontSize: 13,
                                        wordBreak: 'break-word',   // Forza il testo a andare a capo anche senza spazi
                                        overflow: 'hidden',
                                        whiteSpace: 'normal'       // Permette al testo di andare a capo
                                      }}
                                    >
                                      {row.customer.name}
                                    </Typography>
                </TableCell>
                <TableCell component="th" scope="row">
                                    <Typography
                                      sx={{
                                        fontSize: 13,
                                        wordBreak: 'break-word',   // Forza il testo a andare a capo anche senza spazi
                                        overflow: 'hidden',
                                        whiteSpace: 'normal'       // Permette al testo di andare a capo
                                      }}
                                    >
                                      {row.product.name}
                                    </Typography>
                </TableCell>
                <TableCell>
										<Grid container spacing={0} justifyContent="flex-end" alignItems="center">
                      <Grid item>
                        <IconButton onClick={(event) => handleClickEditMenu(event, row)}>
                          <EditSharpIcon fontSize='small'/>
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton onClick={(event) => handleOpenConfirmationDialog(row)} size='small'>
                          <DeleteSharpIcon fontSize='small'/>
                        </IconButton>
                      </Grid>
                      </Grid>
                </TableCell>
              </TableRow>
            ))
          )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}