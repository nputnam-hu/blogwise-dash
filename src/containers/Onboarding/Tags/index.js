import React, { Component } from 'react'
import {
  Button,
  InputGroup,
  FormGroup,
  Intent,
  ProgressBar,
  Toaster,
  Position,
} from '@blueprintjs/core'
import uuid from 'uuid/v4'
import Client from '../../../client'
import './styles.sass'

function genPlaceholder(index) {
  switch (index % 3) {
    case 0:
      return {
        nameHolder: 'Blogging',
        descriptionHolder: 'What keeps the lights on',
      }
    case 1:
      return {
        nameHolder: 'Programming',
        descriptionHolder: 'The latest from our engineering team',
      }

    case 2:
      return {
        nameHolder: 'Marketing',
        descriptionHolder: 'Reach your customer better',
      }

    default:
      return {}
  }
}

const toaster = Toaster.create()

class Tags extends Component {
  constructor() {
    super()
    this.client = new Client()
    this.state = {
      tags: {
        [uuid()]: { name: '', description: '' },
        [uuid()]: { name: '', description: '' },
        [uuid()]: { name: '', description: '' },
      },
    }
  }
  componentDidMount() {
    if (!this.props.location.state) {
      this.props.history.push('/register')
    }
  }
  onTagChange = (e, key) => {
    this.setState({
      tags: {
        ...this.state.tags,
        [key]: { ...this.state.tags[key], [e.target.name]: e.target.value },
      },
    })
  }
  onClick = async () => {
    try {
      const { tags } = this.state
      const nonEmptyTags = Object.keys(tags).reduce((acc, key) => {
        if (tags[key].name) {
          acc[key] = { ...tags[key] }
        }
        return acc
      }, {})
      await this.client.put('/blogs', {
        tags: nonEmptyTags,
      })
      this.props.history.push('/onboarding/3', {
        ...this.props.location.state,
        tags: nonEmptyTags,
      })
    } catch (err) {
      console.error(err)
      toaster.show({
        message: 'Failed to update blog',
        position: Position.TOP,
        intent: Intent.DANGER,
        icon: 'cross',
      })
    }
  }
  addTag = () => {
    this.setState({
      tags: {
        ...this.state.tags,
        [uuid()]: { name: '', description: '' },
      },
    })
  }
  render() {
    const enteredTags = Object.values(this.state.tags).filter(({ name }) =>
      Boolean(name),
    ).length

    return (
      <div className="onboarding-container">
        <div className="onboarding-stepcounter">Step 3 of 4</div>
        <h2>Create Custom Tags</h2>
        <span className="onboarding-subheader">
          Tags are used to group your content into different categories to help
          users navigate your blog. We recommend you start your blog off with at
          least 3 tags.
        </span>
        <ProgressBar
          stripes={false}
          animate={false}
          intent={Intent.SUCCESS}
          value={enteredTags / 3}
        />
        <span className="onboarding-subheader">{enteredTags}/3 Tags</span>
        <div className="onboarding-form tags-form">
          {/* .sort() b/c on Safari Object.keys reoreders off of inputs for some reason */}
          {Object.keys(this.state.tags)
            .sort()
            .map((key, i) => {
              const { nameHolder, descriptionHolder } = genPlaceholder(i)
              return (
                <div className="taginput-container" key={key}>
                  <FormGroup htmlFor="name" label="Name">
                    <InputGroup
                      name="name"
                      placeholder={nameHolder}
                      onChange={e => this.onTagChange(e, key)}
                      value={this.state.tags[key].name}
                      className="name"
                    />
                  </FormGroup>
                  <FormGroup
                    htmlFor="description"
                    label="Description"
                    labelInfo="(optional)"
                  >
                    <InputGroup
                      name="description"
                      className="tag-description"
                      placeholder={descriptionHolder}
                      onChange={e => this.onTagChange(e, key)}
                      value={this.state.tags[key].description}
                    />
                  </FormGroup>
                </div>
              )
            })}
          <Button
            style={{
              alignSelf: 'flex-start',
            }}
            icon="add"
            onClick={this.addTag}
          >
            Add Another Tag
          </Button>
          <Button
            large
            rightIcon="arrow-right"
            intent={Intent.PRIMARY}
            onClick={this.onClick}
          >
            Next Step
          </Button>
          <button onClick={this.onClick} className="onboarding-setuplater">
            I'll set this up later
          </button>
        </div>
      </div>
    )
  }
}

export default Tags
