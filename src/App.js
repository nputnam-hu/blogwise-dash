import React, { Component } from 'react'
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'
import Home from './containers/Home/'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route path="/" component={Home} />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App
