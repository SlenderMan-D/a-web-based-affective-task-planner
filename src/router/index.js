import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import Login from '../pages/User/Log-in'
import Reset from '../pages/User/Reset-PW'
import Signup from '../pages/User/Sign-up'
import Main from '../pages/User/Main'

export default () => (
  <Router>
    <Switch>
      <Route path="/reset">
        <Reset />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route path="/mainpage">
        <Main />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Redirect from="/*" to="/mainpage" />
    </Switch>
  </Router>
);