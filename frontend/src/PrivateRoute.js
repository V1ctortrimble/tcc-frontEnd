import React from 'react'
import { Redirect, Route } from 'react-router-dom';

const PrivateRoute = props => {
    const isLogged = !! localStorage.getItem('token')
        return isLogged ? <Route {...props}/> : <Redirect to="/" /> 
}

    export default PrivateRoute