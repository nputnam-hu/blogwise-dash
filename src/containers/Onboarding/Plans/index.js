import React, { Component } from 'react'
import PlanComp from '../../../components/PlanComp'
import Client from '../../../client'
import './styles.sass'

class Plans extends Component {
  constructor() {
    super()
    this.client = new Client()
  }
  componentDidMount() {
    if (!this.props.location.state) {
      this.props.history.push('/register')
    }
  }
  onChoose = async plan => {
    try {
      await this.client.put('/organizations', { plan })
      this.props.history.push('/onboarding/1', { ...this.props.location.state })
    } catch (err) {
      console.error(err)
    }
  }
  render() {
    return (
      <div id="plans-container">
        <h1>Choose a Plan</h1>
        <PlanComp onChoose={this.onChoose} />
      </div>
    )
  }
}

export default Plans
