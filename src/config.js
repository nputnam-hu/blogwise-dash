import moment from 'moment'

export default {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  stripeToken:
    process.env.REACT_APP_STRIPE_TOKEN || 'pk_test_PLYBUJIxJHsPDp2WbHj90s4S',
  logoutTime: () =>
    moment()
      .add(1, 'days')
      .valueOf(),
  defaultLogo:
    'https://s3.amazonaws.com/megaphone-logo-uploads/defaultLogo.png',
  linkedin: {
    client_id: '78lfgcpfr5idxn',
    client_secret: 'fMC2Eq6BLjVUaE0e',
    redirect_uri: 'http://localhost:3000/dashboard/social',
  },
}
