import { createTheme } from '@mui/material/styles';
import { color, typo } from './styles';

export const theme = createTheme({
  typography: {
    fontFamily: typo.fontFamily,
  },
  palette: {
    text: {
      primary: '#2D2D2D',
    },
    primary: {
      light: '#95a3f9',
      main: '#2c62f6',
      dark: '#003ce6',
      contrastText: '#ffffff',
    },
    error: { main: color.alert },
    deepblue: {
      light: '#4c5870',
      main: '#293142',
      dark: '#293142',
      contrastText: '#ffffff',
    },
    layout: {
      line: '#dee2ec',
      background: '#edeff1',
    },
    bluegrey: {
      700: '#4A4E70',
      600: '#A1B1CA',
      500: '#D7E3F1',
      300: '#E6EEF8',
      200: '#F3F8FF',
      100: '#F9FBFF',
    },
    grey: {
      700: '#2D2D2D',
      600: '#3A3A3A',
      500: '#BBBBBB',
      300: '#E6E6E6',
      200: '#F1F1F1',
    },
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        root: {
          '.MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&:hover': {
            '&& fieldset': {
              borderColor: color.primary.unoblue,
            },
          },
          '&.Mui-disabled select, &.Mui-disabled input': {
            background: color.bluegrey[200],
            WebkitTextFillColor: color.bluegrey[600],
          },
          '&.Mui-disabled': {
            '&& fieldset': {
              borderColor: color.line,
            },
          },
          select: {
            background: 'transparent',
            paddingRight: '16px !important',
          },
          svg: {
            right: '4px',
          },
        },
        input: {
          '&::placeholder': {
            fontSize: 'inherit',
            color: `${color.bluegrey[600]} !important`,
            opacity: 1,
          },
        },
        notchedOutline: {
          borderColor: color.line,
          transition: 'border-color 0.1s',
          borderWidth: '1px !important',
        },
      },
    },
  },
});
