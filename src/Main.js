import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Redirect,
  Route
} from "react-router-dom";

import App from './pages/App/App';
import Login from './pages/Login/index';


export default () => (
  <Router>
    <Switch>
      <Route exact path='/' render={() => <Redirect to='/App/Home' />} />
      <Route path='/App' component={App} />
      <Route path='/Login' component={Login} />
    </Switch>
  </Router>
)
