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
  <Box sx={{ flexGrow: 1, px: { xs: 2, sm: 3 }, mt: 0, mb: 3 }}>
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm={10}>
        <Typography sx={{ mt: 4, mb: 2 }} variant="h6">
          Lowest Level Function Information
        </Typography>
      </Grid>
      <Grid item xs={12} sm={2}>
        {loading && (
          <Box display="flex" justifyContent={{ xs: 'center', sm: 'flex-end' }} sx={{ mt: 3 }}>
            <CircularProgress size="2rem" />
          </Box>
        )}
      </Grid>
    </Grid>

    <Divider sx={{ mb: 2 }} />

    <Grid container spacing={2}>
      <Grid item xs={12} sm={8}>
        <List dense>
          <ListItem>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <ListItemText
                  secondary="Name"
                  primary={<Typography sx={{ fontSize: 16 }}>{data.name}</Typography>}
                />
              </Grid>
              <Grid item xs={12}>
                <ListItemText
                  secondary="Function Level"
                  primary={<Typography sx={{ fontSize: 16 }}>{data.functionLevel?.name}</Typography>}
                />
              </Grid>
            </Grid>
          </ListItem>
        </List>
      </Grid>

      <Grid item xs={12} sm={4}>
        <Typography sx={{ mt: 2, mb: 2 }} variant="h6">
          Applications
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: 16 }}><b>Name</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.functionApplication?.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
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
    <Typography sx={{ mt: 4, mb: 2 }} variant="h6">
      Firmwares
    </Typography>
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell><b>Part Number</b></TableCell>
            <TableCell align="left"><b>Version String</b></TableCell>
            <TableCell align="left"><b>Component Type</b></TableCell>
            <TableCell align="left"><b>Status</b></TableCell>
            <TableCell align="left"><b>Product</b></TableCell>
            <TableCell align="left"><b>Customer</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.lowestLevelFunctionStatus?.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <Typography>{row.firmware.partNumber}</Typography>
              </TableCell>
              <TableCell>
                <Typography>{row.firmware.versionString}</Typography>
              </TableCell>
              <TableCell>
                <Typography>{row.firmware.componentType.name}</Typography>
              </TableCell>
              <TableCell>
                <Typography>
                  {row.functionStatus.name}
                  {(row.effort || row.startDate || row.endDate) && (
                    <ClickAwayListener onClickAway={handleTooltipClose}>
                      <Tooltip
                        PopperProps={{ disablePortal: true }}
                        onClose={handleTooltipClose}
                        open={open}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        title={
                          <>
                            {row.effort && (
                              <Typography sx={{ fontSize: 12 }}>
                                Effort: <b>{row.effort}</b>
                              </Typography>
                            )}
                            {row.startDate && (
                              <Typography sx={{ fontSize: 12 }}>
                                Start: <b>{row.startDate.substring(0, 10)}</b>
                              </Typography>
                            )}
                            {row.endDate && (
                              <Typography sx={{ fontSize: 12 }}>
                                End: <b>{row.endDate.substring(0, 10)}</b>
                              </Typography>
                            )}
                          </>
                        }
                      >
                        <IconButton onClick={handleTooltipOpen} size="small">
                          <InfoSharpIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </ClickAwayListener>
                  )}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{row.firmware.product.name}</Typography>
              </TableCell>
              <TableCell>
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