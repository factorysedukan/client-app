import { createTheme } from '@mui/material/styles';

// Customize your theme here
const theme = createTheme({
  palette: {
    primary: {
      main: '#C84630', // Blue
    },
    secondary: {
      main: '#4B5563', // Orange
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;