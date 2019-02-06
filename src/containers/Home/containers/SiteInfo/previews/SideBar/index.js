import React from 'react'
import { TwitterIcon, FacebookIcon, LinkedinIcon } from 'react-share'
import './styles.sass'

const SideBarPreview = ({
  tags,
  logoUri,
  description,
  twitterUrl,
  facebookUrl,
  linkedinUrl,
}) => (
  <div id="previewcontent">
    <div id="preview">
      {
        <div id="previewitems">
          <div id="explore-container">
            {tags.length > 0 && (
              <React.Fragment>
                <h2 className="rightheader">Explore Topics</h2>
                <ul className="taglist">
                  {tags.map(({ name }) => (
                    <span key={name}>
                      <li>{name}</li>
                    </span>
                  ))}
                </ul>
              </React.Fragment>
            )}
          </div>
          <h2 className="rightheader">About</h2>
          {logoUri && <img alt="Logo Preview" src={logoUri} id="rightlogo" />}
          <div id="blogdescription">{description}</div>
          <span id="moreonblog">Read More &gt;</span>
          <div id="sociallinks">
            {twitterUrl && (
              <a
                href={`https://wwww.twitter.com/${twitterUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterIcon size={32} round />
              </a>
            )}
            {facebookUrl && (
              <a
                href={`https://wwww.facebook.com/${facebookUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookIcon size={32} round />
              </a>
            )}
            {linkedinUrl && (
              <a
                href={`https://wwww.linkedin.com/${linkedinUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedinIcon size={32} round />
              </a>
            )}
          </div>
        </div>
      }
    </div>
  </div>
)

export default SideBarPreview
