import React, { Component } from 'react'
import { Button } from '@blueprintjs/core'
import Client from '../../../../client'
import robot from './postgenius.svg'
import './styles.sass'

const EmptyState = ({ newCalendar }) => (
  <div id="emptystate-container">
    <div id="robot-container">
      <img src={robot} alt="Post Genius Robot" className="postgenius-robot" />
      <div className="speechbubble">
        <p>
          Looks like you haven't scheduled any posts yet. Would you like to
          create a new content strategy?
        </p>
        <br />
        <Button large icon="calendar" onClick={newCalendar}>
          New Strategy
        </Button>
      </div>
    </div>
  </div>
)

class MyPosts extends Component {
  constructor() {
    super()
    this.client = new Client()
    this.state = {
      latestPost: {},
    }
  }
  render() {
    return (
      <div id="myposts-container">
        <h1>My Posts</h1>
        <EmptyState
          newCalendar={() => this.props.history.push('/calendar/new')}
        />
        <br />
        <Button onClick={() => this.props.history.push('/calendar')}>
          View Calendar
        </Button>
      </div>
    )
  }
}

export default MyPosts
