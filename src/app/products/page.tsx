'use client'

import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import ProductsTable from '@/app/ui/products/ProductsTable';


export default function Products() {
  return (
    <Box
    component="main"
    sx={{
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
            <Paper sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
              <ProductsTable />
            </Paper>
      </Container>
    </Box>
  );
}

