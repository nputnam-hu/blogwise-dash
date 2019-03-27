import React, { Component } from 'react'
import { Button } from '@blueprintjs/core'
import Client from '../../../../client'
import store from 'store'

class PaymentDash extends Component {
  constructor(props) {
    super(props)
    this.client = new Client()
    this.state = {
      dataLoading: true,
    }
  }
  componentDidMount() {
    this.client.get('/organizations').then(org => {
      this.setState({ dataLoading: false })
      window.pubillingSettings = {
        app_id: 'wAomrikxtFXP18r5G2wncB2D',
        account_id: org.stripeToken,
        account_hash: store.get('user').token,
        locale: 'en',
      }
      const s = document.createElement('script')
      s.src = 'https://www.pubilling.io/sdk.js'
      s.async = true
      document.body.appendChild(s)
    })
  }
  render() {
    return (
      <div style={{ minHeight: '70vh' }}>
        <Button
          minimal
          icon="arrow-left"
          onClick={() => this.props.history.push('/dashboard/account')}
        >
          Back to Account
        </Button>
        <br />
        <div id="pubilling-embed" />
      </div>
    )
  }
}

export default PaymentDash
