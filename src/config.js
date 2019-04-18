import moment from 'moment'

export default {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  defaultLogo:
    'https://s3.amazonaws.com/megaphone-logo-uploads/defaultLogo.png',
  logoutTime: () =>
    moment()
      .add(1, 'days')
      .valueOf(),
}
