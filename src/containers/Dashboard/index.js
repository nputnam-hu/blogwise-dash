import React from 'react'
import { Link } from 'react-router-dom'
import store from 'store'
import Account from './containers/Account'
import Overview from './containers/Overview'
import MyBlog from './containers/MyBlog'
import MyPosts from './containers/MyPosts'
import PostGenius from './containers/PostGenius'
import CalendarHome from './containers/CalendarHome'
import PaymentDash from './containers/PaymentDash'
import WriterHome from '../Writer/WriterHome'

import { Tabs } from '@blueprintjs/core'
import './styles.sass'

const Dashboard = ({ children, activeTab }) => {
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
        <Tabs.Expander />
      </Tabs>
      <div className="tab-content">{children}</div>
    </div>
  )
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
