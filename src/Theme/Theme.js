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
            disableRipple: true, // No more ripple, on the whole application 💣!
        },
    },
    palette: {
        primary: {
            main: '#ED565D',
        }, // Purple and green play nicely together.
        secondary: {
            main: '#544759',
        }, // This is just green.A700 as hex.
    },
    background: {
        main: '#dbdbdb',
        dark: '#d0d0d0',
        menuBackGround: '#bfbfbf'
    },
    primary: {
        main: '#ED565D'
    },
    secondary: {
        main: '#544759'
    },
    error: {
        main: '#ff2b2b'
    }
});