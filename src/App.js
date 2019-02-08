import React, { Component } from 'react'
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './containers/Dashboard/'
import Register from './containers/Onboarding/Register'
import Header from './containers/Onboarding/Header'
import Tags from './containers/Onboarding/Tags'
import Users from './containers/Onboarding/Users'
import OtherInfo from './containers/Onboarding/OtherInfo'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Navbar />
          <Switch>
            <Route path="/onboarding/4" component={OtherInfo} />
            <Route path="/onboarding/3" component={Users} />
            <Route path="/onboarding/2" component={Tags} />
            <Route path="/onboarding/1" component={Header} />
            <Route path="/register" component={Register} />
            <Route path="/dashboard" component={Dashboard} />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App
