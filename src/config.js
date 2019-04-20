import moment from 'moment'

export default {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  logoutTime: () =>
    moment()
      .add(1, 'days')
      .valueOf(),
}
