import React from 'react'
import { Button } from '@blueprintjs/core'
import store from 'store'
import logo from './logo.png'
import './styles.sass'

const Navbar = () => (
  <div id="navbar-container">
    <a href="/dashboard">
      <img src={logo} alt="Blogwise Logo" id="navbar-logo" />
    </a>
    <Button
      className="logout-button"
      onClick={() => {
        store.remove('user')
        store.remove('blog')
        window.location = '/login'
      }}
    >
      Log Out
    </Button>
  </div>
)

export const ReducedNavbar = () => (
  <div
    id="navbar-container"
    style={{ background: 'white', borderBottom: 'none' }}
  >
    <a href="/">
      <img src={logo} alt="Blogwise Logo" id="navbar-logo" />
    </a>
  </div>
)

export default Navbar
