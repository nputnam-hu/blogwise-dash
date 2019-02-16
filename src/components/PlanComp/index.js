import React from 'react'
import { Button } from '@blueprintjs/core'

const PlanComp = ({ onChoose }) => (
  <div id="plancomp-container">
    <table className="bp3-html-table bp3-html-table-bordered">
      <thead>
        <tr>
          <th>Free</th>
          <th>Starter</th>
          <th>Growth</th>
          <th>Enterprise</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>$0/Month</td>
          <td>$9/Month</td>
          <td>$29/Month</td>
          <td>$59/Month</td>
        </tr>
        <tr>
          <td>1 Staff User</td>
          <td>2 Staff Users</td>
          <td>5 Staff Users</td>
          <td>Unlimited Staff Users</td>
        </tr>
        <tr>
          <td>5k Page Views/Month</td>
          <td>10k Page Views/Month</td>
          <td>100k Page Views/Month</td>
          <td>1M Page Views/Month</td>
        </tr>
        <tr>
          <td>Blogwise Ads</td>
          <td>No Blogwise Ads</td>
          <td>No Blogwise Ads</td>
          <td>No Blogwise Ads</td>
        </tr>
        <tr>
          <td>
            <Button onClick={() => onChoose('FREE')}>Choose This Plan</Button>
          </td>
          <td>
            <Button onClick={() => onChoose('STARTER')}>
              Choose This Plan
            </Button>
          </td>
          <td>
            <Button onClick={() => onChoose('GROWTH')}>Choose This Plan</Button>
          </td>
          <td>
            <Button onClick={() => onChoose('ENTERPRISE')}>
              Choose This Plan
            </Button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
)

export default PlanComp
