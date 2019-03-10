import React, { Component } from 'react'
import { Button, Card, H5 } from '@blueprintjs/core'
import TagModal from './components/TagModal'
import QuestionHint from '../../../../../../components/QuestionHint'
import Client from '../../../../../../client'
import { validateState } from '../../../../../../toaster'
import './styles.sass'

class Tags extends Component {
  constructor() {
    super()
    this.client = new Client()
    this.state = {
      tags: {},
      modalOpen: false,
      modalIsEdit: false,
      modalTagName: '',
      modalTagDescription: '',
      modalTagKey: '',
    }
  }
  componentDidMount() {
    this.client.get('/blogs').then(blog => {
      this.setState({ tags: blog.tags || {} })
    })
  }
  openModalEdit = tagKey =>
    this.setState({
      modalOpen: true,
      modalIsEdit: true,
      modalTagName: this.state.tags[tagKey].name,
      modalTagDescription: this.state.tags[tagKey].description,
      modalTagKey: tagKey,
    })
  openModalNew = () =>
    this.setState({
      modalOpen: true,
      modalIsEdit: false,
      modalTagName: '',
      modalTagDescription: '',
      modalTagKey: '',
    })
  modifyTag = async (tagKey, newTag) => {
    if (!validateState(['name'], newTag)) {
      return
    }
    const newTags = { ...this.state.tags, [tagKey]: newTag }
    await this.client.put('/blogs', { tags: newTags })
    this.setState({
      modalOpen: false,
      tags: newTags,
    })
  }
  handleClose = () => this.setState({ modalOpen: false })
  render() {
    return (
      <>
        <div id="tags-container">
          <div className="section-header">
            <a href="#tags" name="tags">
              <h2>Tags</h2>
            </a>
            <QuestionHint
              title="Tags"
              helperText="Tags are used to categorize your posts into different topics. The tags for each post will be displayed at the bottom of the page, and users can search articles by tag."
            />
          </div>
          {Object.keys(this.state.tags)
            .sort()
            .map(key => {
              const { name, description } = this.state.tags[key]
              return (
                <Card key={key} className="tag-container">
                  <H5>{name}</H5>
                  <p>{description}</p>
                  <Button
                    icon="edit"
                    onClick={() => this.openModalEdit(key)}
                    disabled={this.state.locked}
                  >
                    Edit
                  </Button>
                </Card>
              )
            })}
          <Button
            onClick={this.openModalNew}
            icon="add"
            disabled={this.state.locked}
            large
          >
            New Tag
          </Button>
        </div>
        {/* Modals */}
        <TagModal
          isOpen={this.state.modalOpen}
          handleClose={this.handleClose}
          isEdit={this.state.modalIsEdit}
          modifyTag={this.modifyTag}
          modalTagName={this.state.modalTagName}
          modalTagDescription={this.state.modalTagDescription}
          modalTagKey={this.state.modalTagKey}
        />
      </>
    )
  }
}

export default Tags
