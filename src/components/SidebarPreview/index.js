import React from 'react'
import linkedin from './linkedin.png'
import facebook from './facebook.png'
import twitter from './twitter.png'
import './styles.sass'

const SidebarPreview = ({
  tags,
  logoUri,
  description,
  twitterUrl,
  facebookUrl,
  linkedinUrl,
  companyName,
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
          <h2 className="rightheader">About {companyName}</h2>
          {logoUri && <img alt="Logo Preview" src={logoUri} id="rightlogo" />}
          <div id="blogdescription">{description}</div>
          <span id="moreonblog">READ MORE &gt;</span>
          <h2 className="rightheader">Find us on</h2>
          <div id="sociallinks">
            {twitterUrl && (
              <a
                className="right-sociallink"
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={twitter} alt="twitter" />
              </a>
            )}
            {facebookUrl && (
              <a
                className="right-sociallink"
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={facebook} alt="facebook" />
              </a>
            )}
            {linkedinUrl && (
              <a
                className="right-sociallink"
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={linkedin} alt="linkedin" />
              </a>
            )}
          </div>
        </div>
      }
    </div>
  </div>
)

export default SidebarPreview
