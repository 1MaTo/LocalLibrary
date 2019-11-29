import React from 'react'
import Login from './Login'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

export default function Auth(){

    const loggedIn = useSelector( state => state.user.loggedIn)

    return(
        loggedIn ? <Redirect to="/"/> : <Redirect to="/auth/login"/>
    )
}