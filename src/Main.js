import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Redirect,
  Route
} from "react-router-dom";
import Cookie from 'js-cookie';

import App from './pages/App/App';
import Login from './pages/Login/index';


const fakeAuth = {
  isAuthenticated: () => {
    let isUserLogin = Cookie.getJSON('UserInfo');
    if(!isUserLogin) {
      return false;
    }

    return true;
  }
};
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      fakeAuth.isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.localtion }
          }}
        />
      ))
    }
  />
);

export default () => (
  <Router>
    <Switch>
      <Route exact path='/' render={() => <Redirect to='/App/Home' />} />
      {/* <Route path='/App' component={App} /> */}
      <PrivateRoute path='/App' component={App} />
      <Route path='/Login' component={Login} />
    </Switch>
  </Router>
)
