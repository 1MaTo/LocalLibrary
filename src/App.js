import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom"
import Login from './components/Authentication/Login'
import Home from './components/mainPage/Home'
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { createStore } from "redux"
import { Provider } from "react-redux"
import { reducer } from './store/reducer'
import { ThemeProvider } from '@material-ui/styles';
import { theme } from './Theme/Theme'
import { StylesProvider } from '@material-ui/styles';
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

function App() {
  
  return (
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Router>
            <Route path="/" exact component={Home} />
            <Route path="/login" component={Login} />
          </Router>
          <GlobalStyle theme={theme}/>
        </Provider>
      </ThemeProvider>
    </StylesProvider>
  );
}
export default App;