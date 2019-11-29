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

const GlobalStyle = createGlobalStyle`
  a {
    color: inherit;
    text-decoration: none;
  }
  body {
    background: ${ props => props.theme.background.main};
    margin: 0;
  }
  .MuiFormControl-root {
    display: flex;
    margin-bottom: 30px;
  }

`
const store = createStore(reducer)

const Index = () => {
    return (
        <StylesProvider injectFirst>
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <App />
                    <GlobalStyle theme={theme} />
                </Provider>
            </ThemeProvider>
        </StylesProvider >
    )
}

ReactDOM.render(<Index/>, document.getElementById('root'));