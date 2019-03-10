import React from 'react'
import { Button } from '@blueprintjs/core'
import lightning from './lightning.png'
import './styles.sass'

const PricingCard = ({
  bgColor,
  name,
  price,
  users,
  pageviews,
  branding,
  onClick,
}) => (
  <div className="pricingcard-container">
    <div className="pricingcard-top" style={{ background: bgColor }}>
      <h2>{name}</h2>
    </div>
    <div className="pricingcard-bottom">
      <h1>${price}</h1>
      <span className="permonth">per month, billed monthly</span>
      <ul className="pricingcard-list">
        <li>
          <img src={lightning} alt="Bullet Point" />
          <span>
            {users} Staff User
            {(parseInt(users, 10) > 1 || users === 'Unlimited') && 's'}
          </span>
        </li>
        <li>
          <img src={lightning} alt="Bullet Point" />
          <span>{pageviews} page views/mo</span>
        </li>
        <li>
          <img src={lightning} alt="Bullet Point" />
          <span>{branding ? 'blogwise branding' : 'ad free'}</span>
        </li>
      </ul>
      <Button onClick={onClick}>Choose This Plan</Button>
    </div>
  </div>
)

const PlanComp = ({ onChoose }) => (
  <div id="plancomp-container">
    <div id="pricingcards">
      <PricingCard
        bgColor="rgba(204, 204, 204, 0.42)"
        name="Free"
        price="0"
        users="1"
        pageviews="5k"
        branding
        onClick={() => onChoose('FREE')}
      />
      <PricingCard
        bgColor="rgba(103, 180, 249, 0.26)"
        name="Starter"
        price="9"
        users="2"
        pageviews="10k"
        onClick={() => onChoose('STARTER')}
      />
      <PricingCard
        bgColor="rgba(103, 180, 249, 0.4)"
        name="Startup"
        price="29"
        users="5"
        pageviews="50k"
        onClick={() => onChoose('GROWTH')}
      />
      <PricingCard
        bgColor="rgba(59, 103, 226, 0.4)"
        name="Enterprise"
        price="59"
        users="Unlimited"
        pageviews="500k"
        onClick={() => onChoose('ENTERPRISE')}
      />
    </div>
    <a
      className="learnmore"
      href="https://www.blogwise.co/pricing"
      target="_blank"
      rel="noopener noreferrer"
    >
      Learn More
    </a>
  </div>
)

export default PlanComp
