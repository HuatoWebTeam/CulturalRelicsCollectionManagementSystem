import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Redirect,
  Route
} from "react-router-dom";
// import Cookie from 'js-cookie';
import moment from 'moment';
import App from './pages/App/App';
import Login from './pages/Login/index';


const fakeAuth = {
  isAuthenticated: () => {
    let isUserLogin = sessionStorage.getItem('UserInfo');
    
    
    if(!isUserLogin) {
      return false;
    } else {
      let LoginTime = JSON.parse(isUserLogin).LoginTime;
      console.log(LoginTime);
      let timeDiff = moment().diff(moment(LoginTime), "minute"); 
      console.log(timeDiff);
      if(timeDiff >= 180) {   // 登录时间大于等于3小时 重新登录
        sessionStorage.removeItem("UserInfo");
        return false;
      } else {
        return true;
      }
      
    }

    
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
