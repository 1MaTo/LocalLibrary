import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createStore } from "redux"
import { reducer } from './store/reducer'
import { Provider } from "react-redux"
import { ThemeProvider } from '@material-ui/styles';
import { StylesProvider } from '@material-ui/styles';
import { theme } from './Theme/Theme'
import { createGlobalStyle } from "styled-components"
import { SnackbarProvider } from 'notistack';
import 'typeface-roboto';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import moment from "moment";
import MomentUtils from "@date-io/moment";
import "moment/locale/ru";

const GlobalStyle = createGlobalStyle`
  a {
    color: inherit;
    text-decoration: none;
    display: contents;
  }
  body {
    background: ${ props => props.theme.background.main};
    margin: 0;
  }
  .MuiFormControl-root {
    display: flex;
    margin: 15px 0px 15px 0px;
  }
  .MuiButton-root {
    width: fit-content;
  }
  *::-webkit-scrollbar {
    width: 0.5em;
  }
  *::-webkit-scrollbar-thumb {
    background: ${ theme.palette.primary.unhover};
    border-radius: 7px;
  }
  *::-webkit-scrollbar-thumb:hover {
    background: #ed565d;
  }
  #simple-popover {
    z-index: 2;
  }
  .Control-panel .MuiBox-root {
    padding: 0px;
    height: 100%;
  }
`

const store = createStore(reducer)

const snackBarOption = {
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'right',
  },
  autoHideDuration: 3000,
}

moment.locale("ru")

const Index = () => {

  return (
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <SnackbarProvider
            anchorOrigin={snackBarOption.anchorOrigin}
            autoHideDuration={snackBarOption.autoHideDuration}
            maxSnack={3}>
            <MuiPickersUtilsProvider
              libInstance={moment}
              utils={MomentUtils}
              locale={"ru"}>
              <App />
              <GlobalStyle theme={theme} />
            </MuiPickersUtilsProvider>
          </SnackbarProvider>
        </Provider>
      </ThemeProvider>
    </StylesProvider >
  )
}

ReactDOM.render(<Index />, document.getElementById('root'));