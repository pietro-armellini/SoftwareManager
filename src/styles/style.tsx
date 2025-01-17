import { Grid, LinearProgress, linearProgressClasses } from '@mui/material';
import { styled } from '@mui/material/styles';

export const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

//Blue loading circle
export const BorderLinearProgress_blue = styled(LinearProgress)(({ theme }) => ({

  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[800],
    }),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: '#1a90ff',
    ...theme.applyStyles('dark', {
      backgroundColor: '#308fe8',
    }),
  },
}));

//Green loading circle
export const BorderLinearProgress_green = styled(LinearProgress)(({ theme }) => ({

  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[800],
    }),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: 'green',
    ...theme.applyStyles('dark', {
      backgroundColor: '#308fe8',
    }),
  },
}));