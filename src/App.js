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
import WriterRegister from './containers/Writer/WriterRegister'
import WriterInfo from './containers/Writer/WriterInfo'
import WriterHome from './containers/Writer/WriterHome'
import Register from './containers/Onboarding/Register'
import Plans from './containers/Onboarding/Plans'
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
            <ReducedBar path="/writer/register" component={WriterRegister} />
            <ReducedBar path="/writer/onboarding/1" component={WriterInfo} />
            <PrivateRoute path="/writer" component={WriterHome} />
            <ReducedBar path="/login" component={Login} />
            <ReducedBar path="/onboarding/3" component={OtherInfo} />
            <ReducedBar path="/onboarding/2" component={Tags} />
            <ReducedBar path="/onboarding/1" component={Header} />
            <ReducedBar path="/register" component={Register} />
            <ReducedBar path="/plans" component={Plans} />
            <PrivateRoute path="/dashboard" component={Dashboard} />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App
