import React, { Component } from 'react'
import { Tabs, Button, Intent, Spinner } from '@blueprintjs/core'
import { Link } from 'react-router-dom'
import store from 'store'
import QuestionHint from '../../components/QuestionHint'
import Account from './containers/Account'
import Overview from './containers/Overview'
import MyBlog from './containers/MyBlog'
import MyPosts from './containers/MyPosts'
import PostGenius from './containers/PostGenius'
import CalendarHome from './containers/CalendarHome'
import PaymentDash from './containers/PaymentDash'
import Social from './containers/Social'
import WriterHome from '../Writer/WriterHome'
import Client from '../../client'
import errorMessage, { alertUser } from '../../toaster'
import './styles.sass'

class Dashboard extends Component {
  constructor() {
    super()
    this.client = new Client()
    this.state = {
      hasUpdates: false,
      dataSending: false,
    }
  }
  componentDidMount() {
    window.intercomSettings = {
      app_id: 'bnz5sax3',
    }
    const s = document.createElement('script')
    s.innerHTML = `(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/bnz5sax3';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();`
    document.body.appendChild(s)
    this.client
      .get('/blogs/updates')
      .then(hasUpdates => this.setState({ hasUpdates }))
  }
  onClick = async () => {
    this.setState({ dataSending: true })
    try {
      await this.client.post('/blogs/deploy')
      this.setState({ hasUpdates: false })
      alertUser('Success! Updates are building on our servers right now')
    } catch (err) {
      errorMessage('Error publishing updates')
    } finally {
      this.setState({ dataSending: false })
    }
  }
  render() {
    const { children, activeTab } = this.props
    const isAdmin = store.get('user').type === 'ADMIN'
    return (
      <div id="index-container" className="tab-container">
        <Tabs id="TabsExample" className="dashboard-tabs" large>
          {isAdmin ? (
            <Link
              className={activeTab === 'overview' ? 'active' : undefined}
              to="/dashboard"
            >
              Overview
            </Link>
          ) : (
            <Link
              className={activeTab === 'writer' ? 'active' : undefined}
              to="/writer"
            >
              Home
            </Link>
          )}
          {isAdmin && (
            <Link
              className={activeTab === 'myblog' ? 'active' : undefined}
              to="/dashboard/myblog"
            >
              My Blog
            </Link>
          )}
          <Link
            className={activeTab === 'myposts' ? 'active' : undefined}
            to="/dashboard/myposts"
          >
            My Posts
          </Link>
          <Link
            className={activeTab === 'postgenius' ? 'active' : undefined}
            to="/dashboard/postgenius"
          >
            Post Genius
          </Link>
          {isAdmin && (
            <Link
              className={activeTab === 'account' ? 'active' : undefined}
              to="/dashboard/account"
            >
              Account
            </Link>
          )}
          {this.state.hasUpdates &&
            (this.state.dataSending ? (
              <Spinner size={Spinner.SIZE_SMALL} />
            ) : (
              <div className="publishupdates">
                <span className="publishupdates__text">
                  {' '}
                  you have unpublished changes
                </span>
                <Button intent={Intent.SUCCESS} onClick={this.onClick}>
                  Publish Updates
                </Button>
                <QuestionHint
                  dashboard
                  style={{
                    padding: 0,
                    boxSizing: 'initial',
                    marginLeft: '-30px',
                  }}
                  title="Publish Updates"
                  helperText="When you make changes to your blog on the admin dashboard, they are saved, but not published to your live blog immediately. Once you are done making changes, click `Publish Updates` to make your changes live. Each update takes about 2 minutes to be published live."
                />
              </div>
            ))}
          <Tabs.Expander />
        </Tabs>
        <div className="tab-content">{children}</div>
      </div>
    )
  }
}
export const OverviewView = props => (
  <Dashboard activeTab="overview">
    <Overview {...props} />
  </Dashboard>
)

export const MyBlogView = props => (
  <Dashboard activeTab="myblog">
    <MyBlog {...props} />
  </Dashboard>
)

export const MyPostsView = props => (
  <Dashboard activeTab="myposts">
    <MyPosts {...props} />
  </Dashboard>
)

export const PostGeniusView = props => (
  <Dashboard activeTab="postgenius">
    <PostGenius {...props} />
  </Dashboard>
)

export const AccountView = props => (
  <Dashboard activeTab="account">
    <Account {...props} />
  </Dashboard>
)

export const CalendarView = props => (
  <Dashboard activeTab="postgenius">
    <CalendarHome {...props} />
  </Dashboard>
)

export const PaymentDashView = props => (
  <Dashboard activeTab="account">
    <PaymentDash {...props} />
  </Dashboard>
)

export const WriterView = props => (
  <Dashboard activeTab="writer">
    <WriterHome {...props} />
  </Dashboard>
)

export const SocialView = props => (
  <Dashboard>
    <Social {...props} />
  </Dashboard>
)
