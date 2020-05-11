import { createMuiTheme } from '@material-ui/core/styles';
/*
export const Theme = {
    firstColor: '#544759',
    secondColor: '#F3F4F6',
    thirdColor: '#B2BFCF',
    fourthColor: '#EC575D'
}*/

export const theme = createMuiTheme({
    props: {
        MuiButtonBase: {
            // The properties to apply
            disableRipple: false, // No more ripple, on the whole application 💣!
        },
    },
    palette: {
        primary: {
            main: '#ED565D',
            unhover: '#ed565d80'
        }, // Purple and green play nicely together.
        secondary: {
            main: '#544759',
        }, // This is just green.A700 as hex.
        error: {
            main: '#f44336'
        },
        text : {
            active: "#000000",
            main: "#E1E1E1"
        },
        warning: {
            main: '#ff9800'
        },
        info: {
            main: '#2196f3'
        },
        success: {
            main: '#4caf50'
        },
        background: {
            main: '#dbdbdb',
            dark: '#c5c5c5',
            dark2: '#ffffff',
            highlight: '#b7b7b7'
        }
    },
    background: {
        main: '#dbdbdb',
        dark: '#d0d0d0',
        menuBackGround: '#bfbfbf'
    }
});