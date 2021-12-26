import { createTheme, responsiveFontSizes } from '@mui/material/styles';

var theme = createTheme({
    palette: {
        primary: {
            light: '#ffffff',
            main: '#3f50b5',
            dark: '#002884',
            contrastText: '#fff',
        },
    },
});

theme = responsiveFontSizes(theme);

export default theme;