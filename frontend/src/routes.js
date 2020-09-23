import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Router } from 'react-router';
import PrivateRoute from './PrivateRoute';
import { history } from './history';

import home from './pages/home';
import Login from './pages/Login';
import RecoverPassword from './pages/RecoverPassword';

export default function Routes() {
    return (
        <Router history={history}>
            <Switch>
                <Route path="/" exact component={Login} />
                <Route path="/api/login" exact component={Login} />
                <Route path="/recoverPassword" exact component={RecoverPassword} />
                <PrivateRoute path="/home" exact component={home} />
            </Switch>
        </Router>
    );
}