import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom"
import Login from './components/Authentication/Login'
import Home from './components/mainPage/Home'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from './config'
import axios from 'axios'
import Auth from './components/Authentication/Auth'
import SingUp from './components/Authentication/SingUp'
import Lk from './components/Lk/lk'
import { Loading } from './components/Loading/Loading'

axios.defaults.baseURL = serverUrl
axios.defaults.headers.post['Content-Type'] = 'application/JSON';
axios.defaults.headers.get['Content-Type'] = 'application/JSON';
axios.defaults.withCredentials = true

function App() {

  const dispatch = useDispatch()
  const isLogin = useSelector(state => state.isLogin)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get('/api/user/info')
      .then((response) => {
        if (response.status === 200) {
          dispatch({ type: "SET_USER", user: response.data })
          dispatch({ type: "SET_LOGIN", isLogin: true })
          setLoading(false)
        }
      })
      .catch( err => {
        setLoading(false)
      })
  }, [isLogin])

  const PrivateRoute = ({ children, ...rest }) => {
    return (
      <Route
        {...rest}
        render={() =>
          isLogin ? (
            children
          ) : (
              <Redirect
                to={{
                  pathname: "/auth/login",
                }}
              />
            )
        }
      />
    );
  }

  return (
    loading ? <Loading /> :
      <Router>
        <Route path="/" exact component={Home} />
        <Route path="/auth" component={Auth} />
        <Route path="/auth/login" component={Login} />
        <Route path="/auth/registration" component={SingUp} />
        <PrivateRoute path="/lk">
          <Lk />
        </PrivateRoute>
      </Router>
  );
}
export default App;