import React from 'react'
import { Link } from 'react-router-dom'
import Account from './containers/Account'
import Overview from './containers/Overview'
import MyBlog from './containers/MyBlog'
import MyPosts from './containers/MyPosts'
import CalendarHome from './containers/CalendarHome'

import { Tabs } from '@blueprintjs/core'
import './styles.sass'

const Dashboard = ({ children, activeTab }) => (
  <div id="index-container" className="tab-container">
    <Tabs id="TabsExample" className="dashboard-tabs" large>
      <Link
        className={activeTab === 'overview' ? 'active' : undefined}
        to="/dashboard"
      >
        Overview
      </Link>
      <Link
        className={activeTab === 'myblog' ? 'active' : undefined}
        to="/dashboard/myblog"
      >
        My Blog
      </Link>
      <Link
        className={activeTab === 'myposts' ? 'active' : undefined}
        to="/dashboard/myposts"
      >
        Post Genius
      </Link>
      <Link
        className={activeTab === 'account' ? 'active' : undefined}
        to="/dashboard/account"
      >
        Account
      </Link>
      <Tabs.Expander />
    </Tabs>
    <div className="tab-content">{children}</div>
  </div>
)

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

export const AccountView = props => (
  <Dashboard activeTab="account">
    <Account {...props} />
  </Dashboard>
)

export const CalendarView = props => (
  <Dashboard activeTab="myposts">
    <CalendarHome {...props} />
  </Dashboard>
)
