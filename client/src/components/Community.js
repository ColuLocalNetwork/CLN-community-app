import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {formatWei} from 'utils/format'
import classNames from 'classnames'
import CommunityLogo from 'components/elements/CommunityLogo'
import identity from 'lodash/identity'

export default class Community extends Component {
  render () {
    return <div className={this.props.coinWrapperClassName}>
      <div className='coin-header' onClick={this.props.handleOpen}>
        <CommunityLogo token={this.props.token} />
        <div className='coin-details'>
          <h3 className='coin-name'>{this.props.token.name}</h3>
          <p className='coin-total'>
            Total CC supply
            <span className={classNames('total-text', 'positive-number')}>
              {formatWei(this.props.token.totalSupply, 0)}
            </span>
          </p>
        </div>
      </div>
    </div>
  }
}

Community.defaultProps = {
  coinWrapperClassName: 'coin-wrapper',
  token: {},
  handleOpen: identity
}

Community.propTypes = {
  coinWrapperClassName: PropTypes.string,
  handleOpen: PropTypes.func,
  token: PropTypes.object
}
