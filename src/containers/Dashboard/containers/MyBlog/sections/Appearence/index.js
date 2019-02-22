import React from 'react'
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
        <h2>Customize Appearence</h2>
      </a>
      <QuestionHint
        title="Customize Appearence"
        helperText="You can customize the appearence of your blog by uploading images, choosing colors, including links to your social media accounts, and more."
      />
    </div>
    <div id="appearence-cards">
      <a href="/edit/header">
        <Card
          className="uicomponent-card"
          interactive
          elevation={Elevation.TWO}
        >
          <h2>Homepage Header</h2>
          <img src={header} alt="Header" />
        </Card>
      </a>
      <a href="/edit/sidebar">
        <Card
          className="uicomponent-card"
          interactive
          elevation={Elevation.TWO}
        >
          <h2>Homepage Sidebar</h2>
          <img src={sidebar} alt="Sidebar" />
        </Card>
      </a>
      <a href="/edit/navbar">
        <Card
          className="uicomponent-card"
          interactive
          elevation={Elevation.TWO}
        >
          <h2>Navigation Bar</h2>
          <img src={navbar} alt="Navbar" />
        </Card>
      </a>
    </div>
  </div>
)

export default Appearence
