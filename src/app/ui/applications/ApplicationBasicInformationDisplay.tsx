import { Box, Typography, Divider, Grid, List,  ListItem, ListItemText } from '@mui/material';
import React from 'react';


//component that shows the basic information about a application
export function ApplcationBasicInformationDisplay({ application }) {
  return (
    <>
      <Box sx={{flexGrow: 1, paddingLeft:3, paddingRight:3, marginTop:0, marginBottom:3}} >
        <Typography sx={{ mt: 0, mb: 0 }} variant="h6" component="div">
          Application Information
        </Typography>
        <Divider />
        <Grid container>
          <Grid item xs={12}>
            <List dense>
              <ListItem >
                <Grid container>
									{/* Name */}
                  <Grid item xs={12}>
                    <ListItemText secondary="Name" primary={<Typography sx={{ fontSize: 14}}>{application?.name}</Typography>}></ListItemText>
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
