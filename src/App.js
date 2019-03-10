import React, { Component } from 'react'
import {
  Switch,
  Route,
  Redirect,
  BrowserRouter as Router,
} from 'react-router-dom'
import store from 'store'
import Navbar, { ReducedNavbar } from './components/Navbar'
import {
  OverviewView,
  MyBlogView,
  AccountView,
  MyPostsView,
} from './containers/Dashboard/'
import HomeHeader from './containers/EditAppearence/HomeHeader'
import Login from './containers/Login'
import WriterRegister from './containers/Writer/WriterRegister'
import WriterInfo from './containers/Writer/WriterInfo'
import WriterHome from './containers/Writer/WriterHome'
import Register from './containers/Onboarding/Register'
import Plans from './containers/Onboarding/Plans'
import Header from './containers/Onboarding/Header'
import Tags from './containers/Onboarding/Tags'
import OtherInfo from './containers/Onboarding/OtherInfo'
import Home from './containers/Home'
import HomeSidebar from './containers/EditAppearence/HomeSidebar'
import BlogNavbar from './containers/EditAppearence/BlogNavbar'
import ForgotPassword from './containers/ForgotPassword'
import ResetPassword from './containers/ResetPassword'
import Footer from './components/Footer'
import NewTasks from './containers/Calendar/NewTasks'
import NewCalendar from './containers/Calendar/NewCalendar'

const PrivateRoute = ({ component: MainComponent, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      store.get('user') ? (
        <div style={{ position: 'relative' }}>
          <Navbar />
          <MainComponent {...props} />
          <Footer />
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

const NoBar = ({ component: MainComponent, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      <div>
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
            <ReducedBar path="/forgotpassword" component={ForgotPassword} />
            <ReducedBar path="/resetpassword" component={ResetPassword} />
            <ReducedBar path="/onboarding/3" component={OtherInfo} />
            <ReducedBar path="/onboarding/2" component={Tags} />
            <ReducedBar path="/onboarding/1" component={Header} />
            <ReducedBar path="/register" component={Register} />
            <ReducedBar path="/plans" component={Plans} />
            <NoBar path="/edit/header" component={HomeHeader} />
            <NoBar path="/edit/sidebar" component={HomeSidebar} />
            <NoBar path="/edit/navbar" component={BlogNavbar} />
            <PrivateRoute path="/calendar/new" component={NewCalendar} />
            <PrivateRoute path="/calendar/tasks" component={NewTasks} />
            <PrivateRoute path="/dashboard/account" component={AccountView} />
            <PrivateRoute path="/dashboard/myposts" component={MyPostsView} />
            <PrivateRoute path="/dashboard/myblog" component={MyBlogView} />
            <PrivateRoute path="/dashboard" component={OverviewView} />
            <ReducedBar path="/" component={Home} />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App
