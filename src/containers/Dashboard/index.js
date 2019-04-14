import React, { Component } from 'react'
import {
  Popover,
  Icon,
  H5,
  PopoverInteractionKind,
  Spinner,
} from '@blueprintjs/core'
import { Link } from 'react-router-dom'
import store from 'store'
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
    const hasUpdates = store.get('hasUpdates')
    if (!hasUpdates) {
      this.client
        .get('/blogs/updates')
        .then(blogHasUpdates => store.set('hasUpdates', blogHasUpdates))
    }
  }
  onClick = async () => {
    this.setState({ dataSending: true })
    try {
      await this.client.post('/blogs/deploy')
      store.set('hasUpdates', false)
      alertUser('Success! Updates are building on our servers right now')
    } catch (err) {
      errorMessage('Error publishing updates')
    } finally {
      this.setState({ dataSending: false })
    }
  }
  render() {
    const { children, activeTab } = this.props
    const hasUpdates = store.get('hasUpdates')
    const isAdmin = store.get('user').type === 'ADMIN'
    return (
      <div id="index-container" className="tab-container">
        <div className="dashboard-tabs">
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
            PostGenius
          </Link>
          {isAdmin && (
            <Link
              className={activeTab === 'account' ? 'active' : undefined}
              to="/dashboard/account"
            >
              Account
            </Link>
          )}
          {this.state.dataSending ? (
            <Spinner size={Spinner.SIZE_SMALL} />
          ) : (
            <div
              className="publishupdates"
              style={{ visibility: hasUpdates ? 'visible' : 'hidden' }}
            >
              <button onClick={this.onClick}>Publish Updates</button>
              <Popover
                interactionKind={PopoverInteractionKind.HOVER}
                className="publishupdates__popover"
                minimal
              >
                <Icon
                  icon="help"
                  iconSize={15}
                  style={{
                    // padding: 0,
                    boxSizing: 'initial',
                    marginLeft: '-25px',
                  }}
                />
                <div id="popover-container">
                  <H5>Publish Updates</H5>
                  <p>
                    When you make changes to your blog on the admin dashboard,
                    they are saved, but not published to your live blog
                    immediately. Once you are done making changes, click
                    `Publish Updates` to make your changes live. Each update
                    takes about 2 minutes to be published live.
                  </p>
                </div>
              </Popover>
            </div>
          )}
        </div>
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
