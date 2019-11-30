import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom"
import Login from './components/Authentication/Login'
import Home from './components/mainPage/Home'
import { useDispatch } from 'react-redux'
import { serverUrl } from './config'
import axios from 'axios'
import Auth from './components/Authentication/Auth'
import SingUp from './components/Authentication/SingUp'

axios.defaults.baseURL = serverUrl
axios.defaults.headers.post['Content-Type'] = 'application/JSON';
axios.defaults.headers.get['Content-Type'] = 'application/JSON';
axios.defaults.withCredentials = true

function App() {

  const dispatch = useDispatch()

  useEffect(() => {
    axios
      .get('/api/user/info')
      .then((response) => {
        if (response.status === 200) {
          dispatch({ type: "SET_USER", user: response.data })
          const user = response.data
          console.log(user)
        }
      })
  })

  return (
    <Router>
      <Route path="/" exact component={Home} />
      <Route path="/auth" component={Auth} />
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/registration" component={SingUp} />
    </Router>
  );
}
export default App;