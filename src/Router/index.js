import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from '../pages/Home/Home';
import About from '../pages/About/About';
class Routes extends Component {
    
    render() {
        console.log(this.props)
        return (
        <Switch>
            <Route exact path="/App/Home" component={Home} />
            <Route exact path="/App/About" component={About} />
            <Route render={() => <Redirect to='/App/Home' /> } />
          </Switch>
        )
    }
}
// const Routes = [
//     { 
//         path: '/',
//         con
//     }
// ]

export default Routes;