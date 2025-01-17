'use client'; // Indicate that this file is intended to be run on the client-side

import * as React from 'react'; // Importing React
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'; // Import AppBar component from Material-UI
import MuiDrawer from '@mui/material/Drawer'; // Import Drawer component for sidebar
import Box from '@mui/material/Box'; // Import Box component for layout
import Toolbar from '@mui/material/Toolbar'; // Import Toolbar component for placing elements in AppBar
import IconButton from '@mui/material/IconButton'; // Import IconButton for clickable icons
import Typography from '@mui/material/Typography'; // Import Typography for text styling
import MenuIcon from '@mui/icons-material/Menu'; // Import Menu icon for drawer toggle
import Divider from '@mui/material/Divider'; // Import Divider for visual separation
import { styled } from '@mui/material/styles'; // Import styled utility for custom styling
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'; // Import icon for closing the drawer
import List from '@mui/material/List'; // Import List component for navigation items
import { PrimaryListItems } from './ListItems'; // Import primary navigation items

function ResponsiveAppBar() {
  // State to manage drawer open/close status
  const [open, setOpen] = React.useState(false); 
  // Function to toggle the drawer open/close state
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const drawerWidth: number = 240; // Define width of the drawer

  // Interface to extend AppBarProps with optional 'open' prop
  interface AppBarProps extends MuiAppBarProps {
    open?: boolean; 
  }
  
  // Styled AppBar component with responsive behavior based on drawer state
  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open', // Prevent 'open' prop from being forwarded to the DOM
  })<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1, // Ensure AppBar is above the drawer
    transition: theme.transitions.create(['width', 'margin'], { // Smooth transition for width and margin
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && { // Adjust AppBar when the drawer is open
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`, // Calculate width based on drawer width
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));
  
  // Styled Drawer component with responsive behavior based on open state
  const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })( // Prevent 'open' prop from being forwarded
    ({ theme, open }) => ({
      '& .MuiDrawer-paper': {
        position: 'relative', // Position relative for styling
        whiteSpace: 'nowrap', // Prevent text wrapping
        width: drawerWidth, // Set drawer width
        transition: theme.transitions.create('width', { // Smooth transition for width
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        boxSizing: 'border-box', // Ensure box model includes padding and border in width
        ...(!open && { // Styles when the drawer is closed
          overflowX: 'hidden', // Prevent horizontal overflow
          transition: theme.transitions.create('width', { // Smooth transition for closing
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          width: theme.spacing(7), // Adjust width when closed
          [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9), // Adjust width for larger screens
          },
        }),
      },
    }),
  );

  // Main return for the component
  return (
    <Box>
      {/* AppBar component at the top of the layout */}
      <AppBar position="fixed" open={open}>
        <Toolbar
          sx={{
            pr: '24px', // Keep right padding when drawer is closed
          }}
        >
          {/* IconButton to open/close the drawer */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer} // Trigger toggle function on click
            sx={{
              marginRight: '36px',
              ...(open && { display: 'none' }), // Hide when drawer is open
            }}
          >
            <MenuIcon /> {/* Menu icon for drawer toggle */}
          </IconButton>
          {/* Title for the AppBar */}
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }} // Allow title to grow and fill space
          >
            Software Manager
          </Typography>
        </Toolbar>
      </AppBar>
      
      {/* Drawer component for navigation */}
      <Drawer variant="permanent" open={open} sx={{height:"100%"}}>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end', // Align items to the right
            px: [1], // Horizontal padding
          }}
        >
          {/* IconButton to close the drawer */}
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon /> {/* Icon for closing the drawer */}
          </IconButton>
        </Toolbar>
        <Divider /> {/* Divider for visual separation */}
        <List component="nav">
          <PrimaryListItems /> {/* Primary navigation items */}
          {/* 
          Uncomment the following lines to add secondary navigation items 
          <Divider sx={{ my: 1 }} />
          <SecondaryListItems /> 
          */}
        </List>
      </Drawer>
    </Box>
  );
}

export default ResponsiveAppBar; // Export the ResponsiveAppBar component for use in other files
