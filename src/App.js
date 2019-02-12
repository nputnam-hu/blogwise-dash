import React, { Component } from 'react'
import {
  Switch,
  Route,
  Redirect,
  BrowserRouter as Router,
} from 'react-router-dom'
import store from 'store'
import Navbar, { ReducedNavbar } from './components/Navbar'
import Dashboard from './containers/Dashboard/'
import Login from './containers/Login'
import Register from './containers/Onboarding/Register'
import Header from './containers/Onboarding/Header'
import Tags from './containers/Onboarding/Tags'
import OtherInfo from './containers/Onboarding/OtherInfo'

const PrivateRoute = ({ component: MainComponent, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      store.get('user') ? (
        <div>
          <Navbar />
          <MainComponent {...props} />
        </div>
      ) : (
        <Redirect to="/login" />
      )
    }
  />
)

const ReducedBar = ({ component: MainComponent, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      <div>
        <ReducedNavbar />
        <MainComponent {...props} />
      </div>
    )}
  />
)

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            <ReducedBar path="/login" component={Login} />
            <ReducedBar path="/onboarding/3" component={OtherInfo} />
            <ReducedBar path="/onboarding/2" component={Tags} />
            <ReducedBar path="/onboarding/1" component={Header} />
            <ReducedBar path="/register" component={Register} />
            <PrivateRoute path="/dashboard" component={Dashboard} />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App
