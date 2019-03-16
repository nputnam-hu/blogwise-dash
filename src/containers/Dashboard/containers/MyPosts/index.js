import React, { Component } from 'react'
import { ButtonGroup, Button, AnchorButton, Spinner } from '@blueprintjs/core'
import { TwitterTweetEmbed } from 'react-twitter-embed'
import moment from 'moment'
import QuestionHint from '../../../../components/QuestionHint'
import Client from '../../../../client'
import robot from '../../postgenius.svg'
import './styles.sass'

const Robot = ({ children }) => (
  <div id="robot-container">
    <img src={robot} alt="Post Genius Robot" className="postgenius-robot" />
    <div className="speechbubble">{children}</div>
  </div>
)

class MyPosts extends Component {
  constructor() {
    super()
    this.client = new Client()
    this.state = {
      headlines: [],
      latestPost: {},
      dataLoading: true,
    }
  }
  componentDidMount() {
    this.client.get('/blogs').then(blog => {
      this.client.post('/blogs/content').then(headlines => {
        this.client.get('/calendars/posts/next').then(latestPost => {
          this.setState({
            headlines,
            latestPost,
            siteUrl: blog.siteUrl,
            dataLoading: false,
          })
        })
      })
    })
  }
  render() {
    const { headlines, latestPost, siteUrl } = this.state
    const cmsUrl = !siteUrl
      ? ''
      : `${
          siteUrl.includes('https://') ? '' : 'https://'
        }${siteUrl}/admin/#/collections/blog/new`
    return (
      <div id="myposts-container">
        {this.state.dataLoading ? (
          <Spinner />
        ) : (
          <>
            <Robot>
              {!latestPost ? (
                <>
                  <p>
                    Looks like you haven't scheduled any posts yet. Would you
                    like to create a new content strategy?
                  </p>

                  <br />
                  <div className="emptystate__buttoncontainer">
                    <Button
                      large
                      icon="calendar"
                      onClick={() => this.props.history.push('/calendar/new')}
                    >
                      New Strategy
                    </Button>
                    <QuestionHint
                      title="Content Strategies"
                      helperText="Content strategies help you plan out your blog posts into advance to achieve your marketing and branding goals. First, brainstorm posts to write and then we'll schedule them out over a specified time range. Then we'll send out email reminders with content suggestions and inspiration to help you start writing."
                      style={{ marginTop: '10px' }}
                      iconSize={19}
                    />
                  </div>
                </>
              ) : (
                <>
                  <p>
                    Your next scheduled post is <b>{latestPost.title.trim()}</b>
                    , tagged{' '}
                    {latestPost.tags.map((t, i) => (
                      <i key={t.value}>
                        {t.label}
                        {i !== latestPost.tags.length - 1 ? ', ' : '. '}
                      </i>
                    ))}
                    It is scheduled for{' '}
                    {moment(latestPost.dueDate).format('LL')}.
                  </p>
                  <div className="firstpost__buttons">
                    <ButtonGroup>
                      <AnchorButton
                        href={cmsUrl}
                        target="_blank"
                        rel="nooponer noreferrer"
                        icon="document-open"
                        large
                      >
                        Open Content Manager
                      </AnchorButton>
                      <Button
                        large
                        icon="calendar"
                        onClick={() => this.props.history.push('/calendar')}
                      >
                        Manage Scheduled Posts
                      </Button>
                    </ButtonGroup>
                  </div>
                </>
              )}
            </Robot>
            <div style={{ height: '40px' }} />
            <div className="myposts__bottomcontent">
              <div className="bottomcontent__col">
                <div className="section-header">
                  <h2>Suggested Articles</h2>
                </div>
                {headlines.length > 0 && (
                  <ul>
                    {headlines.map(headline => (
                      <li className="headline-container" key={headline}>
                        <span className="headline">{headline}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {latestPost && (
                <div className="bottomcontent__col">
                  <div className="section-header">
                    <h2>
                      Tweets Relevant to <i>{latestPost.title}</i>
                    </h2>
                  </div>
                  <div className="bottomcontent__tweets">
                    {latestPost.relevantTweets.map(({ id }) => (
                      <TwitterTweetEmbed key={id} tweetId={id} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    )
  }
}

export default MyPosts
