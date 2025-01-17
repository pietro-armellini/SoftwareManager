'use client'

import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import FirmwareAdd from '@/app/ui/firmwares/FirmwareAdd';


export default function AddFirmware() {
  return (
    <Box
    component="main"
    sx={{
      width:100,
      backgroundColor: (theme) =>
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[900],
      flexGrow: 1,
      height: '100vh',
      overflow: 'auto',
    }}>
    <Toolbar/>
      <Container sx={{ mt: 4, mb: 4, width:'100%' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
              <FirmwareAdd />
            </Paper>
          </Grid>            
        </Grid>
      </Container>
    </Box>

    
  );
  
}

