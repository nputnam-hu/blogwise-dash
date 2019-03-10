import React from 'react'
import { Link } from 'react-router-dom'
import { Card, Elevation } from '@blueprintjs/core'
import QuestionHint from '../../../../../../components/QuestionHint'
import sidebar from './sidebar.png'
import navbar from './navbar.png'
import header from './header.png'
import './styles.sass'

const Appearence = () => (
  <div id="appearence-container">
    <div className="section-header">
      <a href="#appearence" name="appearence">
        <h2>Customize Appearance</h2>
      </a>
      <QuestionHint
        title="Customize Appearance"
        helperText="You can customize the appearence of your blog by uploading images, choosing colors, including links to your social media accounts, and more."
      />
    </div>
    <div id="appearence-cards">
      <Link to="/edit/header">
        <Card
          className="uicomponent-card"
          interactive
          elevation={Elevation.TWO}
        >
          <img src={header} alt="Header" />
          <h2>Homepage Header</h2>
        </Card>
      </Link>
      <Link to="/edit/sidebar">
        <Card
          className="uicomponent-card"
          interactive
          elevation={Elevation.TWO}
        >
          <img src={sidebar} alt="Sidebar" />
          <h2>Homepage Sidebar</h2>
        </Card>
      </Link>
      <Link to="/edit/navbar">
        <Card
          className="uicomponent-card"
          interactive
          elevation={Elevation.TWO}
        >
          <img src={navbar} alt="Navbar" />
          <h2>Navigation Bar</h2>
        </Card>
      </Link>
    </div>
  </div>
)

export default Appearence
