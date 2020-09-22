import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';

import home from './pages/home';
import Login from './pages/Login';
import RecoverPassword from './pages/RecoverPassword';

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Login} />
                <Route path="/api/login" exact component={Login} />
                <Route path="/recoverPassword" exact component={RecoverPassword} />
                <PrivateRoute path="/home" exact component={home} />
            </Switch>
        </BrowserRouter>
    );
}