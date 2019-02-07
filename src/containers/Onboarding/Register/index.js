import React, { Component } from 'react'
import {
  Button,
  Intent,
  FormGroup,
  InputGroup,
  RadioGroup,
  Radio,
} from '@blueprintjs/core'
import './styles.sass'

class Register extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    surveyAnswer: '',
  }
  onChange = e => this.setState({ [e.target.name]: e.target.value })
  onRadioChange = e => this.setState({ surveyAnswer: e.target.value })
  onClick = () => {
    if (!this.state.name || !this.state.email) {
      return
    }
    this.props.history.push('/onboarding/1', { ...this.state })
  }
  render() {
    return (
      <div className="onboarding-container">
        <div className="onboarding-stepcounter">Step 1 of 5</div>
        <h2>Let's Create Something Special</h2>
        <span className="onboarding-subheader">
          Get a world-class blog up in just minutes.
        </span>
        <div className="onboarding-form">
          <FormGroup htmlFor="name" label="Name">
            <InputGroup
              name="name"
              value={this.state.name}
              onChange={this.onChange}
              placeholder="Steve Jobs"
            />
          </FormGroup>
          <FormGroup htmlFor="email" label="Email">
            <InputGroup
              name="email"
              value={this.state.email}
              onChange={this.onChange}
              placeholder="steve@apple.com"
            />
          </FormGroup>
          <FormGroup htmlFor="password" label="Choose a Password">
            <InputGroup
              name="password"
              type="password"
              value={this.state.password}
              onChange={this.onChange}
              placeholder="**********"
            />
          </FormGroup>
          <RadioGroup
            name="surveryAnswer"
            label="What is the main goal you have for your blog?"
            onChange={this.onRadioChange}
            selectedValue={this.state.surveyAnswer}
          >
            <Radio label="Reaching new customers" value="marketing" />
            <Radio label="Engaging existing customers" value="engaging" />
            <Radio label="Recruiting talented employeees" value="recruiting" />
            <Radio label="Other" value="other" />
          </RadioGroup>
          <br />
          <Button
            large
            rightIcon="arrow-right"
            intent={Intent.SUCCESS}
            onClick={this.onClick}
          >
            Create your blog
          </Button>
        </div>
      </div>
    )
  }
}

export default Register
