import React, { Component } from 'react'
import { Spinner } from '@blueprintjs/core'
import Client from '../../../../client'
import PricingCardGrid from './PricingCardGrid'
import './styles.sass'
import BlueButton from '../../../../components/BlueButton'

const upperFirst = str => str && `${str[0].toUpperCase()}${str.slice(1)}`

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
    this.client
      .get('/organizations')
      .then(org => {
        this.setState({ plan: org.plan, dataLoading: false })
      })
      .catch(() => this.setState({ plan: 'invalid', dataLoading: false }))
  }
  render() {
    const plan = this.state.plan.toLowerCase()
    return (
      <div id="account-container">
        {this.state.dataLoading ? (
          <Spinner />
        ) : (
          <>
            <div>
              Your account is on the <br />
              <h2 className="plan__header">{upperFirst(plan)} Plan</h2>
            </div>
            <br />
            <BlueButton
              onClick={() => this.props.history.push('/dashboard/payment')}
            >
              See Payment Dashboard
            </BlueButton>
            <div style={{ height: '70px' }} />
            <PricingCardGrid activePlan={this.state.plan} />
          </>
        )}
      </div>
    )
  }
}

export default Account
