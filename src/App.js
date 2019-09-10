import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom"
import LoginContext from './context/login'
import Login from './components/Authentication/Login'
import Lk from './components/accountManagement/Lk'
import Home from './components/mainPage/Home'
import List from './components/bookList/List'
import SingleBook from './components/singleBookPage/SingleBook'
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { createStore } from "redux"
import { Provider } from "react-redux"
import { reducer } from './store/reducer'

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
  const [isLogin, setLogin] = useState()
  const [userName, setUserName] = useState()

  CheckSessionKey({ changeLogin: setLogin, changeName: setUserName })

  function handleLoginChange(props) {
    setLogin(props.isLogin)
    setUserName(props.username)
  }

  const classes = useStyles()
  return (
    <Provider store={store}>
      <LoginContext.Provider
        value={{
          login: isLogin,
          username: userName,
          changeLoginState: setLogin,
          changeUserName: setUserName
        }}>
        <Router className={`${classes.a} ${classes.root}`}>
          <Route path="/" exact component={Home} />
          <Route path="/list" exact component={List} />
          <Route path="/login" render={() => isLogin ? (<Redirect to="/lk" />) : (<Login handleLoginChange={handleLoginChange} />)} />
          <Route path="/lk" render={() => isLogin ? (<Lk />) : (<Redirect to="/login" />)} />
          <Route path='/book/:id' component={SingleBook} />
          <Route path='/book/:id/edit' component={SingleBook} />
        </Router>
      </LoginContext.Provider>
    </Provider>
  );
}


function CheckSessionKey(props) {

  const data = {
    username: getCookie('username'),
    sessionKey: getCookie('sessionKey')
  }

  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:8080/getSessionKey', true);
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.send(JSON.stringify(data));
  return (
    xhr.onreadystatechange = function (res) {
      if (xhr.readyState !== 4) return;
      if (xhr.status !== 200) {
        console.log('Cant recieve session key or key not approved')
        return false
      } else {
        console.log('Key recieved and approved')
        props.changeLogin(true)
        props.changeName(data.username)
        return true
      }
    })
}

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    // eslint-disable-next-line no-useless-escape
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export default App;