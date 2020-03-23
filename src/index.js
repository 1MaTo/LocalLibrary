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
`
const store = createStore(reducer)

const snackBarOption = {
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'right',
  },
  autoHideDuration: 3000,
}

const Index = () => {
  return (
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <SnackbarProvider
            anchorOrigin={snackBarOption.anchorOrigin}
            autoHideDuration={snackBarOption.autoHideDuration}
            maxSnack={3}>
            <App />
            <GlobalStyle theme={theme} />
          </SnackbarProvider>
        </Provider>
      </ThemeProvider>
    </StylesProvider >
  )
}

ReactDOM.render(<Index />, document.getElementById('root'));