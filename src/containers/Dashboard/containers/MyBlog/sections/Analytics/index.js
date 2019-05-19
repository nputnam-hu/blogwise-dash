import React, { Component } from 'react'
import { InputGroup, FormGroup } from '@blueprintjs/core'
import QuestionHint from '../../../../../../components/QuestionHint'
import Client from '../../../../../../client'
import BlueButton from '../../../../../../components/BlueButton'

export default class Analytics extends Component {
  constructor(props) {
    super(props)
    this.client = new Client()
    this.state = {
      googleAnalyticsToken: '',
    }
  }

  componentDidMount() {
    this.client
      .get('/blogs')
      .then(blog =>
        this.setState({ googleAnalyticsToken: blog.googleAnalyticsToken }),
      )
  }

  updateAnalytics = async () =>
    await this.client.put('/blogs', {
      ...this.state,
    })

  onChange = e => this.setState({ [e.target.name]: e.target.value })
  render() {
    return (
      <div>
        <div className="section-header myblog">
          <h2>Google Analytics</h2>
          <QuestionHint
            title="Analytics"
            helperText="Input a Google Analytics token to use Google Analytics with your blog. This will allow you to monitor user interaction with your blog through your Google Analytics dashboard."
          />
        </div>
        <FormGroup
          htmlfor="googleAnalyticsToken"
          label="Google Analytics Token"
        >
          <InputGroup
            name="googleAnalyticsToken"
            defaultValue={this.state.googleAnalyticsToken}
            onChange={this.onChange}
            autoFocus
          />
        </FormGroup>
        <BlueButton onClick={this.updateAnalytics}>Save Token</BlueButton>
      </div>
    )
  }
}
