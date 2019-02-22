import React, { Component } from 'react'
import Client from '../../../../client'
import './styles.sass'

class Account extends Component {
  constructor() {
    super()
    this.client = new Client()
    this.state = {
      plan: '',
      dataLoading: true,
    }
  }
  componentDidMount() {
    this.client.get('/organizations').then(org => {
      this.setState({ plan: org.plan, dataLoading: false })
    })
  }
  render() {
    return (
      <div id="account-container">
        <div>Account</div>
      </div>
    )
  }
}

export default Account
