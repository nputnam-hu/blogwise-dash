import React, { Component } from 'react'
import {
  ButtonGroup,
  Button,
  Spinner,
  Popover,
  PopoverInteractionKind,
  Position,
} from '@blueprintjs/core'
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

class PostGenius extends Component {
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
    this.client.post('/blogs/content').then(headlines => {
      this.client.get('/calendars/posts/next').then(latestPost => {
        this.setState({
          headlines,
          latestPost,
          dataLoading: false,
        })
      })
    })
  }
  render() {
    const { headlines, latestPost } = this.state
    return (
      <div id="postgenius-container">
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
                      <Button
                        onClick={() =>
                          this.props.history.push('/posts/new', {
                            tags: this.state.latestPost.tags,
                            title: this.state.latestPost.title,
                          })
                        }
                        icon="document-open"
                        large
                      >
                        Write This Post
                      </Button>
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
            <div className="postgenius__bottomcontent">
              <div className="bottomcontent__col">
                <div className="section-header">
                  <h2>Suggested Articles</h2>
                </div>
                {headlines.length > 0 && (
                  <ul>
                    {headlines.map(headline => (
                      <Popover
                        interactionKind={PopoverInteractionKind.HOVER}
                        position={Position.TOP}
                        key={headline}
                      >
                        <li className="headline-container">
                          <span className="headline">{headline}</span>
                        </li>
                        <Button
                          rightIcon="document-open"
                          onClick={() =>
                            this.props.history.push('/posts/new', {
                              title: headline,
                            })
                          }
                        >
                          {' '}
                          Write This
                        </Button>
                      </Popover>
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

export default PostGenius
