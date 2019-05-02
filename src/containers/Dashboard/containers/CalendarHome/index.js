import React, { Component } from 'react'
import FullCalendar from 'fullcalendar-reactwrapper'
import Select from 'react-select'
import {
  Button,
  Dialog,
  FormGroup,
  InputGroup,
  Spinner,
  Popover
} from '@blueprintjs/core'
import moment from 'moment'
import { DateInput } from '@blueprintjs/datetime'
import Client from '../../../../client'
import errorMessage, { validateState, alertUser } from '../../../../toaster'
import './styles.sass'

function mapPostsToFullCalendarEvents(posts) {
  return posts.map(post => ({
    title: post.title,
    id: post.id,
    tags: post.tags,
    start: post.dueDate,
    end: post.dueDate,
  }))
}

class CalendarHome extends Component {
  constructor() {
    super()
    this.client = new Client()
    this.state = {
      posts: [],
      tagNames: [],
      editEventModalOpen: false,
      eventToEdit: {},
      eventEdited: false,
      dataLoading: true,
    }
  }
  componentDidMount() {
    this.client.get('/calendars/posts').then(posts => {
      this.setState({
        posts,
      })
      this.client.get('/blogs').then(blog => {
        const tagNames = Object.keys(blog.tags).map(key => ({
          value: key,
          label: blog.tags[key].name,
        }))
        this.setState({ tagNames, dataLoading: false })
      })
    })
  }
  onChange = e =>
    this.setState({
      eventEdited: true,
      eventToEdit: {
        ...this.state.eventToEdit,
        [e.target.name]: e.target.value,
      },
    })
  openEditEventModal = event => {
    this.setState({
      editEventModalOpen: true,
      eventEdited: false,
      eventToEdit: event,
    })
  }
  closeEditEventModal = () => {
    this.setState({
      editEventModalOpen: false,
      eventEdited: false,
      eventToEdit: {},
    })
  }
  editEvent = async () => {
    try {
      if (
        !validateState(
          [['title', 'Headline'], ['start', 'Due Date']],
          this.state.eventToEdit,
        )
      ) {
        return
      }
      const post = await this.client.put('/calendars/posts', {
        id: this.state.eventToEdit.id,
        post: {
          tags: this.state.eventToEdit.tags,
          title: this.state.eventToEdit.title,
          dueDate: this.state.eventToEdit.start,
        },
      })
      const newPosts = [...this.state.posts.filter(p => p.id !== post.id), post]
      this.setState({ posts: newPosts })
      alertUser('Post Saved')
      this.closeEditEventModal()
    } catch (err) {
      errorMessage('There was a problem saving your event')
    }
  }
  render() {
    return (
      <div id="calendarhome-container">
        {/* <Button
          small
          icon="arrow-left"
          minimal
          onClick={() => this.props.history.push('/dashboard/postgenius')}
        >
          Back to Post Genius
        </Button> */}
        <div id="calendar-wrapper">
          {/* <h1>Editorial Calendar</h1> */}
          {this.state.dataLoading ? (
            <Spinner />
          ) : (
            <FullCalendar
              id="fullcalendar"
              defaultView="month"
              duration={{ days: 30 }}
              height={600}
              customButtons={{
                newPost: {
                  text: 'New Post',
                  click: function() {
                    alert('clicked custom')
                  },
                },
              }}
              buttonText={{
                today: 'Today',
              }}
              header={{
                left: 'today prev,next title',
                center: '',
                right: 'newPost',
              }}
              events={mapPostsToFullCalendarEvents(this.state.posts)}
              eventClick={this.openEditEventModal}
            />
          )}
        </div>
        {/* Modals -> reaplce with popover */}
        <Popover
          icon="calendar"
          isOpen={this.state.editEventModalOpen}
          onClose={this.closeEditEventModal}
        >
          <div id="editevent-modal">
            <FormGroup htmlFor="title" label="Post Headline">
              <InputGroup
                name="title"
                placeholder="Your headline here"
                value={this.state.eventToEdit.title}
                onChange={this.onChange}
              />
            </FormGroup>
            <FormGroup htmlFor="tags" label="Tags" labelInfo="(optional)">
              <Select
                isMulti
                name="currentTags"
                options={this.state.tagNames}
                value={this.state.eventToEdit.tags}
                onChange={tags =>
                  this.setState({
                    eventEdited: true,
                    eventToEdit: {
                      ...this.state.eventToEdit,
                      tags,
                    },
                  })
                }
                className="tagmultiselect"
              />
            </FormGroup>
            <FormGroup htmlFor="duedate-picker" label="Due Date">
              <DateInput
                name="duedate-picker"
                value={
                  this.state.eventToEdit.start &&
                  this.state.eventToEdit.start.toDate()
                }
                formatDate={date => moment(date).format('LL')}
                parseDate={str => moment(str).toDate()}
                onChange={selectedDate => {
                  this.setState({
                    eventEdited: true,
                    eventToEdit: {
                      ...this.state.eventToEdit,
                      start: moment(selectedDate),
                    },
                  })
                }}
              />
            </FormGroup>
            <Button onClick={this.editEvent} disabled={!this.state.eventEdited}>
              Save Event
            </Button>
          </div>
        </Popover>
      </div>
    )
  }
}

export default CalendarHome
