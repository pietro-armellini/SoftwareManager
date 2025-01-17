import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import TextField from "@mui/material/TextField"
import Box from "@mui/material/Box"
import AddSharpIcon from '@mui/icons-material/AddSharp';
import EditSharpIcon from '@mui/icons-material/EditSharp';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Snackbar, SnackbarContent, Typography, CircularProgress } from '@mui/material';
import { lightBlue, green, red } from '@mui/material/colors';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductEdit from './ProductEdit';

/* 
Notes:
- ProductToDelete and DeletedProduct are probably redundant, only one is needed
- All snackbars can be component themselves, since they are used all over the code
*/

//Component to view products
export default function ProductsTable() {
  const [data, setData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state
  const [deletedSnackbar, setDeletedSnackbar] = useState(false);
  const [failedDeletedSnackbar, setFailedDeletedSnackbar] = useState(false);
  const [addedSnackbar, setAddedSnackbar] = useState(false);
	//state variable to set the object to delete when pressing the delete icon
  const [objectToDelete, setObjectToDelete] = useState<any>(null);
	//state variable to set the just deleted object
  const [deletedName, setDeletedName] = useState('');
	//state variable to set the object to edit
	const [objectToEdit, setObjectToEdit] = useState('');
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [editedSnackbar, setEditedSnackbar] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
		setLoading(true); // Set loading to true before fetching
    fetchData();
		//if param succ is true it means productAdd component just pushed to the table after successfully adding a new entry
    if (searchParams.has('succ')) {
      router.push("/products");
      setAddedSnackbar(true);
    }
  }, []);

  const fetchData = async () => {
    const response = await fetch("/api/products/detailedlist");
    const jsonData = await response.json();
    setData(jsonData.data);
    setLoading(false); // Set loading to false after fetching
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
    await fetch('/api/products/removeProduct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "id": String(objectToDelete.id) }),
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
        setDeletedSnackbar(true);
        setDeletedName(objectToDelete.name);
				//refetch data 
        fetchData();
        handleCloseConfirmationDialog();
        setObjectToDelete(null);
      } else {
        setFailedDeletedSnackbar(true);
        setDeletedName(objectToDelete.name);
      }
    });  
  };

	//function to close the edit dialog
  const closeEditDialog = () => {
    setShowEditDialog(false);
  };

	//function to open the edit dialog
  const handleOpenEditDialog = (component) => {
    setObjectToEdit(component);
    setShowEditDialog(true); 
  };

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

	//function used by the Edit Dialog to close itself when the editing went successfully
  const handleCloseEditDialogFromChild = () => {
    closeEditDialog();
    setEditedSnackbar(true);
    fetchData();
  };

  return (
    <Box>
			{/* Deleted Snackbar */}
      <Snackbar
        open={deletedSnackbar}
        autoHideDuration={3000}
        onClose={() => { setDeletedSnackbar(false); }}
      >
        <SnackbarContent
          sx={{ backgroundColor: lightBlue[600] }}
          message={`Product "${deletedName}" deleted successfully`}
        />
      </Snackbar>

			{/* Delete Failed Snackbar */}
      <Snackbar
        open={failedDeletedSnackbar}
        autoHideDuration={3000}
        onClose={() => { setFailedDeletedSnackbar(false); }}
      >
        <SnackbarContent
          sx={{ backgroundColor: red[600] }}
          message={`Product "${deletedName}" couldn't be successfully deleted`}
        />
      </Snackbar>

			{/* Added snackbar */}
      <Snackbar
        open={addedSnackbar}
        autoHideDuration={3000}
        onClose={() => { setAddedSnackbar(false); }}
      >
        <SnackbarContent
          sx={{ backgroundColor: green[600] }}
          message={`Product Added successfully`}
        />
      </Snackbar>

			{/* Edited Snackbar */}
      <Snackbar
        open={editedSnackbar}
        autoHideDuration={3000}
        onClose={() => { setEditedSnackbar(false); }}
      >
        <SnackbarContent
          sx={{ backgroundColor: green[600] }}
          message={`Product Edited successfully`}
        />
      </Snackbar>

			{/* Delete Dialog */}
      <Dialog open={showConfirmationDialog} onClose={handleCloseConfirmationDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the product "{objectToDelete && objectToDelete.name}"?
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
          maxWidth: 'none', 
        },
      }}>
        <DialogContent>
          <ProductEdit elementToEdit={objectToEdit} handleCloseFromParentDialog={handleCloseEditDialogFromChild} />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Typography sx={{ mt: 4, mb: 2, ml: 4 }} variant="h6" component="div">
        Products
      </Typography>
      <Box textAlign="right" sx={{ marginRight: 4, marginLeft: 4, marginTop: -5 }}>
        <Button href="/products/addproduct" aria-label="add product" size='small'>
          <AddSharpIcon />
          <Typography sx={{ fontSize: 15 }}>Add Product</Typography>
        </Button>
      </Box>

			{/* Search filter */}
      <Box sx={{ marginRight: 4, marginLeft: 4, marginTop: 2 }}>
        <TextField
          label="Search Product"
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
              <TableCell sx={{ fontSize: 15, minWidth: 200 }}><b>Name</b></TableCell>
              <TableCell sx={{ fontSize: 15, minWidth: 300 }}><b>Firmwares</b></TableCell>
              <TableCell sx={{ fontSize: 15, width: 40 }} align="center"><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
						{/* Loading component */}
            {loading ? (
							//Conditional rendering for loading state variable
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <CircularProgress /> {/* Loading spinner */}
                  <Typography variant="body2" sx={{ mt: 2 }}>Loading data...</Typography>
                </TableCell>
              </TableRow>
							
            ) : filteredData.length === 0 ? (
							//When there are no data to display
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography variant="body2" sx={{ mt: 2 }}>No products available.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Typography sx={{ fontSize: 13 }}>{row.name}</Typography>
                  </TableCell>
                  <TableCell align="left">
                    {row.firmware?.map(firmware => (
                      <Tooltip arrow title={firmware.partNumber} key={firmware.id} placement="left">
                        <Typography sx={{ fontSize: 13 }}>{firmware.partNumber + " | " + firmware.versionString}</Typography>
                      </Tooltip>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Grid container spacing={0}>
                      <Grid item xs={6}>
                        <IconButton onClick={(event) => handleOpenEditDialog(row)}>
                          <EditSharpIcon fontSize='small' />
                        </IconButton>
                      </Grid>
                      <Grid item xs={6}>
                        <IconButton onClick={(event) => handleOpenConfirmationDialog(row)} size='small'>
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
      </TableContainer>
    </Box>
  );
}
