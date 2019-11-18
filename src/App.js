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

const useStyles = makeStyles(() =>
  createStyles({
    '@global a': {
      color: 'inherit',
      textDecoration: 'none',
    },
    '@global body': {
      background: '#f9f9f9',
      margin: 0,
    }
  })
);

const store = createStore(reducer)

function App() {


  const classes = useStyles()
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Router className={`${classes.a} ${classes.root}`}>
          <Route path="/" exact component={Home} />
          <Route path="/login" component={Login} />
        </Router>
      </Provider>
    </ThemeProvider>
  );
}
export default App;