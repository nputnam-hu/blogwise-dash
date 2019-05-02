import React from 'react'

import PricingCard from './PricingCard'

import styles from './PricingCardGrid.module.sass'

const PricingCardGrid = ({ activePlan }) => (
  <div className={styles.pricingCardGrid}>
    <PricingCard
      bgColor="#e6faff"
      title="Starter"
      price="9"
      userNum="2"
      pageViews="5k"
      description="for small businesses"
      activePlan={activePlan === 'STARTER'}
    />
    <PricingCard
      bgColor="rgba(103, 180, 249, 0.4)"
      title="Growth"
      price="29"
      userNum="5"
      pageViews="15k"
      description="for scaling startups"
      activePlan={activePlan === 'GROWTH'}
    />
    <PricingCard
      bgColor="rgba(59, 103, 226, 0.4)"
      title="Enterprise"
      price="99"
      userNum="Unlimited"
      pageViews="50k"
      description="for businesses killing the marketing game"
      activePlan={activePlan === 'ENTERPRISE'}
    />
  </div>
)

export default PricingCardGrid
