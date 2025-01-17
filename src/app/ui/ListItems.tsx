import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton'; // Button component for list items
import ListItemIcon from '@mui/material/ListItemIcon'; // Icon component for list items
import ListItemText from '@mui/material/ListItemText'; // Text component for list items
import DashboardIcon from '@mui/icons-material/Dashboard'; // Dashboard icon
import CalendarViewMonthSharpIcon from '@mui/icons-material/CalendarViewMonthSharp'; // Functions icon
import LabelImportantSharpIcon from '@mui/icons-material/LabelImportantSharp'; // Firmwares icon
import ScannerSharpIcon from '@mui/icons-material/ScannerSharp'; // Products icon
import PeopleSharpIcon from '@mui/icons-material/PeopleSharp'; // Customers icon
import AppsSharpIcon from '@mui/icons-material/AppsSharp'; // Applications icon
import { useRouter } from 'next/navigation'; // Hook to programmatically navigate

// Component for primary navigation items
const PrimaryListItems = () => {
  const router = useRouter(); // Initialize the router

  return (
    <React.Fragment>
      {/* Navigation button for Dashboard */}
      <ListItemButton onClick={() => router.push('/dashboard')}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
      
      {/* Navigation button for Functions */}
      <ListItemButton onClick={() => router.push('/functions')}>
        <ListItemIcon>
          <CalendarViewMonthSharpIcon />
        </ListItemIcon>
        <ListItemText primary="Functions" />
      </ListItemButton>
      
      {/* Navigation button for Applications */}
      <ListItemButton onClick={() => router.push('/applications')}>
        <ListItemIcon>
          <AppsSharpIcon />
        </ListItemIcon>
        <ListItemText primary="Applications" />
      </ListItemButton>
      
      {/* Navigation button for Firmwares */}
      <ListItemButton onClick={() => router.push('/firmwares')}>
        <ListItemIcon>
          <LabelImportantSharpIcon />
        </ListItemIcon>
        <ListItemText primary="Firmwares" />
      </ListItemButton>
      
      {/* Navigation button for Customers */}
      <ListItemButton onClick={() => router.push('/customers')}>
        <ListItemIcon>
          <PeopleSharpIcon />
        </ListItemIcon>
        <ListItemText primary="Customers" />
      </ListItemButton>
      
      {/* Navigation button for Products */}
      <ListItemButton onClick={() => router.push('/products')}>
        <ListItemIcon>
          <ScannerSharpIcon />
        </ListItemIcon>
        <ListItemText primary="Products" />
      </ListItemButton>
    </React.Fragment>
  );
}

// Component for secondary navigation items (currently empty)
// Future settings or other options can be added here
const SecondaryListItems = () => {
  const router = useRouter(); // Initialize the router for secondary navigation

  return (
    <React.Fragment>
      {/* Uncomment to add settings option */}
      {/* 
      <ListSubheader component="div" inset>
      </ListSubheader>
      <ListItemButton onClick={() => router.push('/dashboard/settings')}>
        <ListItemIcon>
          <SettingsSharpIcon />
        </ListItemIcon>
        <ListItemText primary="Settings" />
      </ListItemButton> 
      */}
    </React.Fragment>
  );
}

// Exporting the primary and secondary list item components for use in other parts of the application
export { PrimaryListItems, SecondaryListItems };
