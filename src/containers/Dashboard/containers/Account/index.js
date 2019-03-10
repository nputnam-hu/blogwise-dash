import React, { Component } from 'react'
import { Dialog, Button, Spinner } from '@blueprintjs/core'
import PlanComp from '../../../../components/PlanComp'
import Client from '../../../../client'
import './styles.sass'

class Account extends Component {
  constructor() {
    super()
    this.client = new Client()
    this.state = {
      plan: '',
      dataLoading: true,
      modalOpen: false,
    }
  }
  componentDidMount() {
    this.client.get('/organizations').then(org => {
      this.setState({ plan: org.plan, dataLoading: false })
    })
  }
  onClick = () => this.setState({ modalOpen: true })
  onPlanChoose = plan => {
    this.client.put('/organizations', { plan })
    this.setState({ plan, modalOpen: false })
  }
  handleModalClose = () => this.setState({ modalOpen: false })
  render() {
    return (
      <>
        <div id="account-container">
          <h2>Account</h2>
          {this.state.dataLoading ? (
            <Spinner />
          ) : (
            <>
              <div>
                Your account is on the <b>{this.state.plan.toLowerCase()}</b>{' '}
                plan
              </div>
              <br />
              <Button onClick={this.onClick}>Change</Button>
            </>
          )}
        </div>
        {/* Modals */}
        <Dialog
          isOpen={this.state.modalOpen}
          onClose={this.handleModalClose}
          style={{ padding: 20, width: '95%' }}
        >
          <h2>Choose a Plan</h2>
          <PlanComp onChoose={this.onPlanChoose} />
        </Dialog>
      </>
    )
  }
}

export default Account
