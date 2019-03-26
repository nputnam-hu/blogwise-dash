/* eslint-disable react/no-danger */
import React from 'react'
import moment from 'moment'
import time from './time.svg'
import './styles.sass'

const genText = function genText(date) {
  const m = moment(date)
  const now = moment()
  const daysBetween = moment.duration(now.diff(m)).asDays()
  const roundedDays = Math.floor(daysBetween)
  if (roundedDays === 0) return 'a couple of hours ago'
  if (roundedDays < 30) {
    return `${roundedDays} ${roundedDays === 1 ? 'day' : 'days'} ago`
  }
  const roundedMonths = Math.floor(daysBetween / 30)
  if (roundedMonths < 12) {
    return `${roundedMonths} ${roundedMonths === 1 ? 'month' : 'months'} ago`
  }
  const roundedYears = Math.floor(daysBetween / 365)
  return `${roundedYears} ${roundedYears === 1 ? 'year' : 'years'} ago`
}

const Time = ({ date }) => (
  <div className="time-container">
    <img alt={date.toString()} src={time} />
    <span className="time-text" style={{ fontSize: '16px' }}>
      {genText(date)}
    </span>
  </div>
)

const BlogPostPreview = ({
  title,
  coverPhotoUri,
  description,
  htmlBody,
  tags,
  publishDate,
  author,
}) => (
  <div className="postpreview">
    {!title &&
      !coverPhotoUri &&
      !description &&
      !htmlBody &&
      !tags.length &&
      !publishDate &&
      !author && (
        <h1 style={{ textAlign: 'center', marginTop: '60px' }}>
          Preview Will Appear Here
        </h1>
      )}
    <div className="article">
      <h1 id="article-title">{title}</h1>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {author && (
          <img
            className="authorimg"
            alt={author.name}
            src={author.headshotUri}
          />
        )}
        <div className="authorinfo">
          {author && <div className="article-authorname">{author.name}</div>}
          {publishDate && <Time size="large" date={publishDate} />}
        </div>
      </div>
      <br />
      <i>
        <div
          className="bodytext"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </i>
      <br />
      {coverPhotoUri && <img src={coverPhotoUri} alt="Article Cover" />}
      <br />
      <br />
      <div
        className="bodytext"
        dangerouslySetInnerHTML={{ __html: htmlBody }}
      />
      {tags && tags.length > 0 ? (
        <div style={{ marginTop: `3rem` }}>
          <ul className="taglist">
            {tags.map(tag => (
              <li key={`${tag}tag`}>{tag}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  </div>
)

export default BlogPostPreview
