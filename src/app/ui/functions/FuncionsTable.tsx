import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DoneSharpIcon from '@mui/icons-material/DoneSharp';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import AddSharpIcon from '@mui/icons-material/AddSharp';
import EditSharpIcon from '@mui/icons-material/EditSharp';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Snackbar, SnackbarContent, Tooltip, Typography, TablePagination, CircularProgress } from '@mui/material';
import { lightBlue, green, red } from '@mui/material/colors';
import { useRouter, useSearchParams } from 'next/navigation';
import FunctionEdit from './FunctionEdit';
import { getParentNames, processFunctionElements } from '@/utility/TreeHelper';
import { FunctionElement } from '@/utility/Interfaces';

//Component to view funtions
export default function FunctionsTable() {
  const [data, setData] = useState<FunctionElement[]>([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [searchQuery, setSearchQuery] = useState('');
  const [deletedSnackbar, setDeletedSnackbar] = useState(false);
  const [addedSnackbar, setAddedSnackbar] = useState(false);
  const [failedDeletedSnackbar, setFailedDeletedSnackbar] = useState(false);
	//state variable to set the just deleted object
  const [deletedName, setDeletedName] = useState('');
	//state variable to set the object to delete when pressing the delete icon
  const [objectToDelete, setObjectToDelete] = useState<any>(null);
	//state variable to set the object to edit
  const [objectToEdit, setObjectToEdit] = useState('');
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editedSnackbar, setEditedSnackbar] = useState(false);
	//functions pages variables
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchData();
		//if param succ is true it means FunctionAdd component just pushed to the table after successfully adding a new entry
    if (searchParams.has('succ')) {
      router.push("/functions");
      setAddedSnackbar(true);
    }
  }, []);

  const fetchData = async () => {
    setLoading(true); // Set loading to true before fetching
    const response = await fetch("/api/functions/list"); 
    const jsonData = await response.json();
		//process elements: add to each element a chain of parents til they reach the root node
    const processedElements = processFunctionElements(jsonData.data);
    setData(processedElements);
    setLoading(false); // Data has been fetched
  };

	//filtered data based on the seach filter
  const filteredData = data.filter((row) => {
    return row.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  
	//function to handle the search change
  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

	//function called when pressing on delete icon
  const handleDeleteConfirmation = async () => {
    await fetch('/api/functions/removeFunction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "id": String(objectToDelete.id) }),
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Network response was not successful.');
      }
    })
    .then(data => {
			//code == 1 => success
      if(data.code == 1){
        setDeletedSnackbar(true);
        setDeletedName(objectToDelete.name);
        fetchData();
        handleCloseConfirmationDialog();
        setObjectToDelete(null);
      }
      else{
        setFailedDeletedSnackbar(true);
      }
    });  

    
  };

	//function to close the edit dialog
  const closeEditDialog = () => {
    setShowEditDialog(false);
  };

	//function to open the edit dialog
  const handleOpenEditDialog = (event, component) => {
    setObjectToEdit(component);
    setShowEditDialog(true);
  };

	//function to open the delete confirmation dialog
  const handleOpenConfirmationDialog = (event, component) => {
    setObjectToDelete(component);
    setShowConfirmationDialog(true);
  };

	//function to close the delete confirmation dialog
  const handleCloseConfirmationDialog = () => {
    setShowConfirmationDialog(false);
    setObjectToDelete(null);
  };

	//function used by the Edit Dialog to close itself when the editing went successfully
  const handleCloseEditDialogFromChild = (element, type) => {
    closeEditDialog();
    setEditedSnackbar(true);
    fetchData();
  };

	// Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);


  return (
    <Box>
			
			{/* Deleted Snackbar */}
      <Snackbar
        open={deletedSnackbar}
        autoHideDuration={3000}
        onClose={() => { setDeletedSnackbar(false) }}
      >
        <SnackbarContent
          sx={{ backgroundColor: lightBlue[600] }}
          message={`Function "${deletedName}" deleted successfully`}
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
          message={`Customer "${deletedName}" couldn't be successfully deleted`}
        />
      </Snackbar>

			{/* Added snackbar */}
      <Snackbar
        open={addedSnackbar}
        autoHideDuration={3000}
        onClose={() => { setAddedSnackbar(false) }}
      >
        <SnackbarContent
          sx={{ backgroundColor: green[600] }}
          message={`Function Added successfully`}
        />
      </Snackbar>

			{/* Edited Snackbar */}
      <Snackbar
        open={editedSnackbar}
        autoHideDuration={3000}
        onClose={() => { setEditedSnackbar(false) }}
      >
        <SnackbarContent
          sx={{ backgroundColor: green[600] }}
          message={`Function Edited successfully`}
        />
      </Snackbar>


			{/* Delete Dialog */}
      <Dialog open={showConfirmationDialog} onClose={handleCloseConfirmationDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the function "{objectToDelete && objectToDelete.name}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmationDialog}>Cancel</Button>
          <Button color="error" onClick={handleDeleteConfirmation} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

			{/* Edit dialog */}
      <Dialog open={showEditDialog} onClose={closeEditDialog} PaperProps={{
        style: {
          minWidth: 1000,
          maxWidth: 'none', // Set your desired width here
        },
      }}>
        <DialogContent>
          <FunctionEdit elementToEdit={objectToEdit} handleCloseFromParentDialog={handleCloseEditDialogFromChild} />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Typography sx={{ mt: 4, mb: 2, ml: 4 }} variant="h6" component="div">
        Functions
      </Typography>
      <Box textAlign="right" sx={{ marginRight: 4, marginLeft: 4, marginTop: -5 }}>
        <Button href="/functions/addfunction" aria-label="add board" size='small'>
          <AddSharpIcon />
          <Typography sx={{ fontSize: 15 }}>Add Function</Typography>
        </Button>
      </Box>

			{/* Search filter */}
      <Box sx={{ marginRight: 4, marginLeft: 4, marginTop: 2 }}>
        <TextField
          label="Search Function"
          variant="standard"
          value={searchQuery}
          onChange={handleSearchQueryChange}
          fullWidth
        />
      </Box>

			{/* Main Table */}
      <TableContainer component={Paper} sx={{ paddingLeft: 3, paddingRight: 3, mt: 2 }}>
        <Table sx={{ minWidth: 300, marginBottom: 3 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
							{/* Columns names */}
              <TableCell sx={{ fontSize: 15 }} align="left"><b>Strategic Layer</b> </TableCell>
              <TableCell sx={{ fontSize: 15 }} align="left"><b>Operational Layer</b></TableCell>
              <TableCell sx={{ fontSize: 15 }} align="left"><b>Framework Layer</b></TableCell>
              <TableCell sx={{ fontSize: 15, minWidth: 200 }}><b>Name</b></TableCell>
              <TableCell sx={{ fontSize: 15 }} align="left"><b>Function Level</b></TableCell>
              <TableCell sx={{ fontSize: 15 }} align="center"><b>Lowest Level</b></TableCell>
              <TableCell sx={{ fontSize: 15, width: 40 }} align="center"><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

					{/* Loading component */}
            {loading ? ( // Check if data is loading
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress /> {/* Loading spinner */}
                    <Typography variant="body2" sx={{ mt: 2 }}>Loading data...</Typography>
                    </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? ( // Check if data is empty
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2">No function available</Typography>
                </TableCell>
              </TableRow>
            ) : ( // Render the data
              paginatedData.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Typography sx={{ fontSize: 13 }}>{getParentNames(row)[0]}</Typography>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Typography sx={{ fontSize: 13 }}>{(getParentNames(row)[1] != null ? getParentNames(row)[1] : "-")}</Typography>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Typography sx={{ fontSize: 13 }}>
                      {(row.lowestLevel && row.functionLevel.name === "Core Level" || getParentNames(row)[2] == null ? "-" : getParentNames(row)[2])}
                    </Typography>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Tooltip arrow title={row.functionLevel.name} key={row.id} placement="left">
                      <Typography sx={{ fontSize: 13 }}><b>{row.name}</b></Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Typography sx={{ fontSize: 13 }}>{row.functionLevel?.name}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    {String(row.lowestLevel) === "true" ? (
                      <DoneSharpIcon fontSize='small' sx={{ color: "green" }} />
                    ) : (
                      <CloseSharpIcon fontSize='small' sx={{ color: "red" }} />
                    )}
                  </TableCell>
                  <TableCell>
                    <Grid container spacing={0}>
                      <Grid item xs={6}>
                        <IconButton onClick={(event) => handleOpenEditDialog(event, row)}>
                          <EditSharpIcon fontSize='small' />
                        </IconButton>
                      </Grid>
                      <Grid item xs={6}>
                        <IconButton onClick={(event) => handleOpenConfirmationDialog(event, row)} size='small'>
                          <DeleteSharpIcon fontSize='small' />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
				
				{/* Table Pagination Component */}
        <TablePagination
          component="div"
          count={filteredData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
}
