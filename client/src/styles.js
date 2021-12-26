import { styled } from '@mui/system';

const AppDiv = styled('div')(({ theme }) => ({
    textAlign: 'center',
    backgroundColor: theme.palette.primary.light,
    height: '100vh',
}));

export {AppDiv}