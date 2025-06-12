import React, { useEffect } from 'react';
import { Box, Grid, LinearProgress, linearProgressClasses, styled, Tooltip, Typography } from '@mui/material';
import { BorderLinearProgress_blue, BorderLinearProgress_green } from '@/styles/style';

//Legen items and colors
const legendItems = [
  { label: 'Not Started', color: 'lightgray' },
  { label: 'Implementation Ongoing', color: 'gold' },
  { label: 'R&D Test Ongoing', color: 'orange' },
  { label: 'SAE Test Ongoing', color: 'dodgerblue' },
  { label: 'Field Test Ongoing', color: 'MediumOrchid' },
  { label: 'Finished', color: 'green' },
];

//Component to show the legen in the tree view
export const LegendTree = ({includedPercentage, finishedPercentage, showPercentage}) => {
  
	React.useEffect(() => {
	}, []);

		return (
  <Grid container spacing={2} sx={{ width: '100%', pl: 2 }}>
    
    {/* Legenda */}
    <Grid item xs={12} md={6}>
      <Grid container spacing={1}>
        {legendItems.map((item, index) => (
          <Grid item xs={12} key={index}>
            <Box display="flex" alignItems="center">
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  minWidth: 12,
                  minHeight: 12,
                  border: `2px solid ${item.color}`,
                  borderRadius: '50%',
                  marginRight: '8px',
                  flexShrink: 0,
                }}
              />
              <Typography sx={{ fontSize: 13 }}>{item.label}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Grid>

    {/* Percentuali, sempre a destra anche su XS */}
    {showPercentage && (
  <Grid
  item
  xs={12}
  md={6}
  lg={6}
  sx={{
    display: 'flex',
    justifyContent: {
      xs: 'flex-start',
      md: 'flex-end',
    },
  }}
>
  <Box
    sx={{
      pb: 2,
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      alignItems: 'flex-start',
      minWidth: 220, // 👈 larghezza coerente per entrambe le barre
    }}
  >
    <Box sx={{ width: '100%' }}>
      <Tooltip title="Percentage of application's functions added to the firmware">
        <Typography sx={{ fontSize: 13 }}>
          Functions Included: <b>{includedPercentage}%</b>
        </Typography>
      </Tooltip>
      <BorderLinearProgress_blue variant="determinate" value={includedPercentage} />
    </Box>
    <Box sx={{ width: '100%' }}>
      <Tooltip title="Percentage of included functions already 'finished'">
        <Typography sx={{ fontSize: 13 }}>
          Functions Completed: <b>{finishedPercentage}%</b>
        </Typography>
      </Tooltip>
      <BorderLinearProgress_green variant="determinate" value={finishedPercentage} />
    </Box>
  </Box>
</Grid>

)}

  </Grid>
);


};

//Component to show the legen in the table view
export const LegendTable = ({includedPercentage, finishedPercentage, showPercentage}) => {

  return (
    <Box
    sx={{
      position: 'relative', // Position it absolutely
      backgroundColor: 'white', // Optional: background color for better visibility
      paddingTop:0, // Optional: padding for some space around
      paddingLeft:2
    }}
  >
    <Grid container spacing={0} >
      <Grid item xs={6}>
        <Grid container>
          {legendItems.map((item, index) => (
            <Grid item xs={12} sm={6} xl={4} key={index}>
              <Box display="flex" alignItems="baseline">
                <Box
                  sx={{
                    width: '10px', // Adjust to your desired width
                    height: '10px', // Adjust to your desired height
                    border: `2px solid ${item.color}`, // Border with color
                    marginRight: '5px',
                    backgroundColor: item.color, // Fill color
                  }}
                />
                <Typography sx={{fontSize:13}} variant="body1">{item.label}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Grid>

				{/* Show information about the couple application and filter when they are both selected */}
				{(showPercentage?(
                      <>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Tooltip title="Percentage of application's functions added to the firmware">
                                <Typography sx={{ fontSize: 13 }} variant="body1">
                                    Functions Included: <b>{includedPercentage}%</b>
                                </Typography>
                              </Tooltip>
                              <BorderLinearProgress_blue variant="determinate" value={includedPercentage} />
                            </Grid>
                            <Grid item xs={12}>
                              <Tooltip title="Percentage of included functions already 'finished'">
                                <Typography sx={{ fontSize: 13 }} variant="body1">
                                    Functions Completed: <b>{finishedPercentage}%</b>
                                </Typography>
                              </Tooltip>
                              <BorderLinearProgress_green variant="determinate" value={finishedPercentage} />
                            </Grid>
                          </Grid>
                        
                      </>
        ):null)}
    </Grid>
    </Box>
  );
};


