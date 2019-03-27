import React, { Component } from 'react'
import { Button, Spinner } from '@blueprintjs/core'
import Client from '../../../../client'
import './styles.sass'

class Account extends Component {
  constructor() {
    super()
    this.client = new Client()
    this.state = {
      dataLoading: true,
      modalOpen: false,
      plan: '',
    }
  }
  componentDidMount() {
    this.client.get('/organizations').then(org => {
      this.setState({ plan: org.plan, dataLoading: false })
    })
  }
  render() {
    const plan = this.state.plan.toLowerCase()
    return (
      <div id="account-container">
        <h2>Account</h2>
        {this.state.dataLoading ? (
          <Spinner />
        ) : (
          <>
            <div>
              Your account is on the <b>{plan}</b> plan
            </div>
            <br />
            <Button
              onClick={() => this.props.history.push('/dashboard/payment')}
            >
              See Payment Dashboard
            </Button>
          </>
        )}
      </div>
    )
  }
}

export default Account
