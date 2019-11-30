import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

export default function Auth(){

    const user = useSelector( state => state.user)

    return(
        user ? <Redirect to="/"/> : <Redirect to="/auth/login"/>
    )
}