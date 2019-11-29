import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom"
import Login from './components/Authentication/Login'
import Home from './components/mainPage/Home'
import { useDispatch } from 'react-redux'
import { serverUrl } from './config'
import axios from 'axios'
import { useSelector } from 'react-redux'
import Auth from './components/Authentication/Auth'

axios.defaults.baseURL = serverUrl
axios.defaults.headers.post['Content-Type'] = 'application/JSON';
axios.defaults.headers.get['Content-Type'] = 'application/JSON';
axios.defaults.withCredentials = true

function App() {

  const dispatch = useDispatch()
  const loggedIn = useSelector(state => state.user.loggedIn)

  useEffect(() => {
    axios
      .get('/api/user/info')
      .then((response) => {
        console.log(response.status)
        if (response.status === 200) {
          dispatch({ type: "SET_USER", user: { loggedIn: true, ...response.data } })
          const user = { loggedIn: true, ...response.data }
          console.log(user)
        }
      })
      .catch(error => {

      })
  })

  return (
    <Router>
      <Route path="/" exact component={Home} />
      <Route path="/auth" component={Auth} />
      <Route path="/auth/login" component={Login} />
    </Router>
  );
}
export default App;