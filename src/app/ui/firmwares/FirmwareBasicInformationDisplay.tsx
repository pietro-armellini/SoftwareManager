import { Box, Typography, Divider, Grid, List,  ListItem, ListItemText } from '@mui/material';
import React from 'react';


//component that shows the basic information about a firmware
export function FirmwareBasicInformationDisplay({ firmware }) {
  return (
    <>
      <Box sx={{flexGrow: 1, paddingLeft:3, paddingRight:3, marginTop:0, marginBottom:3}} >
        <Typography sx={{ mt: 0, mb: 0 }} variant="h6" component="div">
          Firmware Information
        </Typography>
        <Divider />
        <Grid container>
          <Grid item xs={12}>
            <List dense>
              <ListItem >
                <Grid container>

									{/* Part Number */}
                  <Grid item xs={12} sm={6}  lg={2.5}>
                    <ListItemText secondary="Part Number" primary={<Typography sx={{ fontSize: 14}}>{firmware?.partNumber}</Typography>}></ListItemText>
                  </Grid>

									{/* Version String */}
                  <Grid item xs={12} sm={6} lg={2.5}>
                    <ListItemText secondary="Version String" primary={<Typography sx={{ fontSize: 14}}>{firmware?.versionString}</Typography>}></ListItemText>
                  </Grid>

									{/* Component Type */}
                  <Grid item xs={12} sm={6} lg={2.5}>
                    <ListItemText secondary="Component Type" primary={<Typography sx={{ fontSize: 14}}>{firmware?.componentType?.name}</Typography>}></ListItemText>
                  </Grid>

									{/* Customer */}
                  <Grid item xs={12} sm={6} lg={2.5}>
                    <ListItemText secondary="Customer" primary={<Typography sx={{ fontSize: 14}}>{firmware?.customer?.name}</Typography>}></ListItemText>
                  </Grid>

									{/* Product */}
                  <Grid item xs={12} sm={6}lg={2}>
                    <ListItemText secondary="Product" primary={<Typography sx={{ fontSize: 14}}>{firmware?.product?.name}</Typography>}></ListItemText>
                  </Grid>
                </Grid>
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

