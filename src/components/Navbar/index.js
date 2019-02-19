import React from 'react'
import store from 'store'
import logo from './logo.png'
import './styles.sass'

const Navbar = () => (
  <div id="navbar-container">
    <img src={logo} alt="Blogwise Logo" id="navbar-logo" />
    <button
      id="logout-button"
      onClick={() => {
        store.remove('user')
        window.location = '/login'
      }}
    >
      Log Out
    </button>
  </div>
)

export const ReducedNavbar = () => (
  <div id="navbar-container">
    <a href="/">
      <img src={logo} alt="Blogwise Logo" id="navbar-logo" />
    </a>
  </div>
)

export default Navbar
