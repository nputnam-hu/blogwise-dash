import React, { Component } from 'react'
import { Button, FormGroup, InputGroup } from '@blueprintjs/core'
import store from 'store'
import errorMessage from '../../errorMessage'
import Client from '../../client'
import './styles.sass'

class Login extends Component {
  constructor() {
    super()
    this.client = new Client()
    this.state = {
      email: '',
      password: '',
    }
  }
  componentDidMount() {
    const user = store.get('user')
    if (user && user.token) {
      this.props.history.push('/dashboard')
    }
  }
  onChange = e => this.setState({ [e.target.name]: e.target.value })
  onClick = async () => {
    if (!this.state.email || !this.state.password) {
      return errorMessage(
        `Please enter a ${this.state.email ? 'password' : 'email'}`,
      )
    }
    try {
      const user = await this.client.post('/auth/login', { ...this.state })
      store.set('user', user)
      this.props.history.push('/dashboard')
    } catch (err) {
      errorMessage('Failed to log in, check your email and password')
    }
  }
  onKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      this.onClick()
    }
  }
  render() {
    return (
      <div className="onboarding-container">
        <h2>Login to Your Account</h2>
        <div className="onboarding-form login">
          <FormGroup htmlFor="email" label="Email">
            <InputGroup
              name="email"
              value={this.state.email}
              onChange={this.onChange}
              placeholder="steve@apple.com"
            />
          </FormGroup>
          <FormGroup htmlFor="password" label="Password">
            <InputGroup
              name="password"
              type="password"
              value={this.state.password}
              onChange={this.onChange}
              onKeyDown={this.onKeyDown}
              placeholder="**********"
            />
          </FormGroup>
          <br />
          <Button large rightIcon="arrow-right" onClick={this.onClick}>
            Login
          </Button>
        </div>
      </div>
    )
  }
}

export default Login
