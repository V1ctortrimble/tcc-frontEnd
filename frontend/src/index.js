/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import './global.css'

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/sass/light-bootstrap-dashboard-react.scss?v=1.3.0";
import "./assets/css/demo.css";
import "./assets/css/pe-icon-7-stroke.css";
import Home from './pages/Home';
import PrivateRoute from './PrivateRoute';
import Login from './pages/Login';
import RecoverPassword from './pages/RecoverPassword';
import ForgetPassword from './pages/ForgetPassword';

import AdminLayout from "layouts/Admin.jsx";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <PrivateRoute path="/home" exact component={Home} />
      <Route path="/forgetPassword" exact component={ForgetPassword} />
      <Route path="/recoverPassword" exact component={RecoverPassword} />
      <PrivateRoute path="/admin" render={props => <AdminLayout {...props} />} />
      <Route path="/" exact component={Login} />

      <Redirect from="/" to="/admin/dashboard" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
