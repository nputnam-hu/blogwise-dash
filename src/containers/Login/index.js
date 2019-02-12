import React, { Component } from 'react'
import {
  Button,
  FormGroup,
  InputGroup,
  Position,
  Toaster,
  Intent,
} from '@blueprintjs/core'
import store from 'store'
import client from '../../client'
import './styles.sass'

const toaster = Toaster.create()

class Login extends Component {
  state = {
    email: '',
    password: '',
  }
  componentDidMount() {
    if (store.get('user')) {
      this.props.history.push('/dashboard')
    }
  }
  onChange = e => this.setState({ [e.target.name]: e.target.value })
  onClick = async () => {
    if (!this.state.email || !this.state.password) {
      return
    }
    try {
      const user = await client.post('/auth/login', { ...this.state })
      store.set('user', user)
      this.props.history.push('/dashboard')
    } catch (err) {
      toaster.show({
        message: 'Failed to log in, check your email and password',
        position: Position.TOP,
        intent: Intent.DANGER,
        icon: 'cross',
      })
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
