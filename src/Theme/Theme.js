import { createMuiTheme } from '@material-ui/core/styles';
/*
export const Theme = {
    firstColor: '#544759',
    secondColor: '#F3F4F6',
    thirdColor: '#B2BFCF',
    fourthColor: '#EC575D'
}*/

export const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#ED565D',
        }, // Purple and green play nicely together.
        secondary: {
            main: '#544759',
        }, // This is just green.A700 as hex.
    },
});