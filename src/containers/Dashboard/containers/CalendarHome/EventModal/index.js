import React, { Component } from 'react'
import moment from 'moment'
import {
  Dialog,
  FormGroup,
  InputGroup,
  Button,
  Popover,
  Position,
} from '@blueprintjs/core'
import { DatePicker } from '@blueprintjs/datetime'
import Select from 'react-select'
import LeaveModal from '../LeaveModal'
import Delete from './delete'
import './styles.sass'
import _ from 'lodash'

const formatTime = time => (time.charAt(0) === '0' ? time.substr(1) : time)

const availableTimes = _.range(24).map(index => {
  return { value: index, label: formatTime(moment(index, 'hh').format('hh a')) }
})

class EditModal extends Component {
  constructor(props) {
    super(props)
    this.client = props.client
    this.state = {
      title: '',
      dueDate: '',
      tags: [],
      authorId: '',
      id: '',
      users: [],
      tagNames: [],
      editMode: false,
    }
    this.selectRef = React.createRef()
  }

  selectStyles = {
    option: (provided, state) => ({
      ...provided,
      padding: '1px 7px 2px 7px',
      backgroundColor: state.isSelected ? '#ECF5FC' : 'white',
      color: 'black',
    }),
    control: provided => ({
      ...provided,
      border: 'none',
      width: 200,
      borderRadius: 0,
      boxShadow: 'none',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    input: provided => ({
      ...provided,
      height: 20,
      width: 200,
      padding: '1px 7px 2px 7px',
      backgroundColor: this.state.editMode ? '#ECF5FC' : 'white',
    }),
  }

  timeSelectStyles = {
    option: (provided, state) => ({
      ...provided,
      padding: '1px 7px 2px 7px',
      backgroundColor: state.isSelected ? '#ECF5FC' : 'white',
      color: 'black',
    }),
    control: provided => ({
      ...provided,
      border: 'none',
      width: 100,
      borderRadius: 0,
      boxShadow: 'none',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    input: provided => ({
      ...provided,
      height: 20,
      width: 100,
      padding: '1px 7px 2px 7px',
      backgroundColor: this.state.editMode ? '#ECF5FC' : 'white',
    }),
  }

  onClickInput = () => this.setState({ editMode: true })
  onChange = e => this.setState({ [e.target.name]: e.target.value })
  onSelectChange = e => this.setState({ type: e.currentTarget.value })
  onClick = () => {
    this.props.submitEvent(this.state)
  }
  onDelete = () => this.props.deletePost(this.state.id)
  writePost = () => {
    this.props.history.push('/posts/new', {
      title: this.state.title,
      tags: this.state.tags,
      author: this.state.authorId,
      publishDate: this.state.dueDate,
    })
  }
  openLeaveModal = () => this.setState({ leaveModalOpen: true })
  closeLeaveModal = () => this.setState({ leaveModalOpen: false })
  onClose = () => {
    this.setState({
      title: '',
      dueDate: '',
      tags: [],
      authorId: {},
      id: '',
      users: [],
      tagNames: [],
      editMode: false,
      datePickerOpen: false,
      hoursSelected: {},
    })
    this.props.handleClose()
  }
  openCropModal = () => this.setState({ cropModalOpen: true })
  handleCropModalClose = () => this.setState({ cropModalOpen: false })
  render() {
    const { isOpen, handleClose } = this.props
    return (
      <Dialog
        isOpen={isOpen}
        onClose={() =>
          this.state.editMode ? this.openLeaveModal() : this.onClose()
        }
        className="eventmodal__popup"
        backdropClassName="eventmodal__backdrop"
        onOpening={() => {
          this.client.get('/organizations/users').then(users => {
            console.log(
              users.filter(u => u.id === this.props.defaultState.authorId)[0],
            )
            this.client.get('/blogs').then(blog => {
              const tagNames = Object.keys(blog.tags).map(key => ({
                value: key,
                label: blog.tags[key].name,
              }))
              const hours = this.props.defaultState.dueDate
                ? moment(this.props.defaultState.dueDate).hours()
                : moment().hours()
              this.setState({
                tagNames,
                users: users.map(u => ({ value: u.id, label: u.name })),
                ...this.props.defaultState,
                authorId: this.props.defaultState.authorId
                  ? users
                      .filter(u => u.id === this.props.defaultState.authorId)
                      .map(u => ({ value: u.id, label: u.name }))[0]
                  : '',
                dueDate: this.props.defaultState.dueDate || moment(),
                hoursSelected: {
                  value: hours,
                  label: formatTime(moment(hours, 'hh').format('hh a')),
                },
                editMode: !this.props.defaultState.title,
              })
            })
          })
        }}
      >
        <div className="eventmodal">
          {!!this.state.id && (
            <button className="delete__button" onClick={this.onDelete}>
              <Delete />
            </button>
          )}
          <textarea
            rows={this.state.title.length / 34 + 1}
            name="title"
            placeholder="Your headline here"
            className={`default__input textarea__input ${this.state.editMode &&
              'edit__input'}`}
            value={this.state.title}
            onChange={this.onChange}
            onClick={this.onClickInput}
          />
          <div className="input__row">
            <Popover position={Position.BOTTOM}>
              <button
                className={`date__input ${this.state.editMode &&
                  'edit__input'}`}
                name="duedate-picker"
                onClick={() => {
                  this.onClickInput()
                }}
              >
                {this.state.dueDate
                  ? this.state.dueDate.format
                    ? this.state.dueDate.format('LL')
                    : moment(this.state.dueDate).format('LL')
                  : 'Due date'}
              </button>
              <DatePicker
                defaultValue={
                  this.state.dueDate && this.state.dueDate.toDate
                    ? this.state.dueDate.toDate()
                    : this.state.dueDate
                }
                onChange={selectedDate =>
                  this.setState({
                    dueDate: selectedDate,
                  })
                }
              />
            </Popover>
            <Select
              styles={this.timeSelectStyles}
              name="time"
              options={availableTimes}
              onChange={e =>
                this.setState({
                  dueDate: moment(this.state.dueDate)
                    .hours(e.value)
                    .minutes(0),
                  hoursSelected: e,
                })
              }
              value={this.state.hoursSelected}
              onFocus={this.onClickInput}
            />
          </div>
          <div className="input__row">
            <div className="input__label">Author</div>
            <div className="select__container">
              <Select
                styles={this.selectStyles}
                name="users"
                options={this.state.users}
                value={this.state.authorId}
                onChange={authorId => this.setState({ authorId })}
                onFocus={this.onClickInput}
              />
            </div>
          </div>
          <div className="input__row">
            <div className="input__label">Tags</div>
            <div className="select__container">
              <Select
                styles={this.selectStyles}
                isMulti
                name="currentTags"
                options={this.state.tagNames}
                value={this.state.tags}
                onChange={tags =>
                  this.setState({
                    tags,
                  })
                }
                className="tagmultiselect"
                onFocus={this.onClickInput}
              />
            </div>
          </div>
          <div className="eventmodal__buttons">
            <button onClick={this.onClick} className="eventmodal__blueButton">
              Save
            </button>
            {this.state.id && (
              <Button
                minimal
                onClick={this.writePost}
                className="eventmodal__writeButton"
              >
                Write this Post
              </Button>
            )}
          </div>
        </div>
        <LeaveModal
          isOpen={this.state.leaveModalOpen}
          handleClose={this.onClick}
          discardChanges={this.onClose}
          closeModal={this.closeLeaveModal}
        />
      </Dialog>
    )
  }
}

export default EditModal
