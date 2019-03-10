import React, { Component } from 'react'
import {
  FormGroup,
  InputGroup,
  Button,
  Popover,
  PopoverInteractionKind,
  Tag,
  Intent,
  Icon,
} from '@blueprintjs/core'
import { DateRangePicker } from '@blueprintjs/datetime'
import Select from 'react-select'
import moment from 'moment'
import './styles.sass'
import errorMessage, { validateState } from '../../../toaster'
import Client from '../../../client'

const MomentDate = ({ date, format }) => {
  const m = moment(date)
  if (m.isValid()) {
    return <Tag intent={Intent.PRIMARY}>{m.format(format)}</Tag>
  }
  return <Tag minimal>no date</Tag>
}

const MomentDateRange = ({ range: [start, end] }) => (
  <div className="daterange">
    <MomentDate date={start} format="dddd, LL" />
    <Icon icon="arrow-right" />
    <MomentDate date={end} format="dddd, LL" />
  </div>
)

class NewCalendar extends Component {
  constructor() {
    super()
    this.client = new Client()
    this.state = {
      users: [],
      selectedUsers: [],
      dateRange: [null, null],
      postCount: 0,
    }
  }
  componentDidMount() {
    this.client.get('/organizations/users').then(users => {
      this.setState({
        users: users.map(u => ({ value: u.id, label: u.name })),
      })
    })
  }
  onChange = e => this.setState({ [e.target.name]: e.target.value })
  onDateChange = dateRange => {
    const [start, end] = dateRange
    let { postCount } = this.state
    if (start && end) {
      postCount = Math.floor((moment(end).diff(moment(start), 'days') * 4) / 7)
    }
    this.setState({
      dateRange,
      postCount,
    })
  }
  onClick = () => {
    if (
      !validateState([['postCount', 'Post Count']], this.state) ||
      !validateState(
        [['0', 'Start Date'], ['1', 'End Date']],
        this.state.dateRange,
      ) ||
      !validateState([['0', 'Assigned Users']], this.state.emails)
    ) {
      return
    }
    if (
      !moment(this.state.dateRange[1]).diff(
        moment(this.state.dateRange[0], 'days') > this.state.postCount,
      )
    ) {
      errorMessage('Posts cannot be scheduled for more than once a day')
      return
    }
    this.props.history.push('/calendar/tasks', { ...this.state })
  }
  render() {
    return (
      <div id="newcalendar-container">
        <div style={{ height: '40px' }} />
        <div className="onboarding-container">
          <h2>New Content Strategy</h2>
          <span className="onboarding-subheader">
            Studies show that blogging is most effective when it is consistent.
            Our integrated editorial calendar makes it easy to plan out content
            strategies into advance.
          </span>
          <br />
          <FormGroup htmlFor="duration" label="Campaign Duration">
            <Popover interactionKind={PopoverInteractionKind.CLICK}>
              <Button>Choose Range</Button>
              <DateRangePicker
                name="duration"
                dateRange={this.state.dateRange}
                onChange={this.onDateChange}
                minDate={moment().toDate()}
                maxDate={moment()
                  .add(3, 'months')
                  .toDate()}
                shortcuts={false}
              />
            </Popover>
          </FormGroup>
          <MomentDateRange range={this.state.dateRange} />
          <FormGroup
            htmlFor="postCount"
            label="Number of Posts"
            helperText="We recommend you plan to write 4-5 posts per week"
          >
            <InputGroup
              name="postCount"
              onChange={this.onChange}
              value={this.state.postCount}
              type="number"
            />
          </FormGroup>
          <FormGroup
            htmlFor="tags"
            label="Assigned Users"
            helperText="Assigned users will recieve email reminders for upcoming posts"
          >
            <Select
              isMulti
              name="tags"
              options={this.state.users}
              value={this.state.selectedUsers}
              onChange={selectedUsers => this.setState({ selectedUsers })}
              className="emailmultiselect"
            />
          </FormGroup>
          <br />
          <Button
            intent={Intent.PRIMARY}
            onClick={this.onClick}
            rightIcon="arrow-right"
            large
          >
            Create Campaign
          </Button>
        </div>
      </div>
    )
  }
}

export default NewCalendar
