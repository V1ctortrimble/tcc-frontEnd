import React from 'react';
import './global.css'
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import PrivateRoute from './PrivateRoute';
import Login from './pages/Login';
import RecoverPassword from './pages/RecoverPassword';
import ForgetPassword from './pages/ForgetPassword';

import AdminLayout from "layouts/Admin.jsx";


function App() {
 
  return (
    <BrowserRouter>
    <Switch>
      <Route path="/forgetPassword" exact component={ForgetPassword} />
      <Route path="/recoverPassword/:code" exact component={RecoverPassword} />
      <PrivateRoute path="/admin" render={props => <AdminLayout {...props} />} />
      <Route path="/" exact component={Login} />
      <Redirect from="/" to="/admin/dashboard" />
    </Switch>
  </BrowserRouter>
  );
}

export default App;
