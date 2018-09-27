import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {formatEther} from 'utils/format'
import Loader from 'components/Loader'
import Info from 'images/info.png'
import CoinIcon from 'images/coin.png'
import {PRICE_EXPLANATION_MODAL} from 'constants/uiConstants'

export default class CoinHeader extends Component {
  loadModal = (e) => {
    this.props.loadModal(PRICE_EXPLANATION_MODAL, {token: this.props.token})
    e.stopPropagation()
  }

  render () {
    const {currentPrice, name, symbol} = this.props.token
    const {balance} = this.props
    const formattedPrice = (currentPrice || currentPrice === 0) && formatEther(currentPrice)
    const fiatCurrencyPrice = this.props.fiat.USD && this.props.fiat.USD.price
    const fiatPrice = currentPrice * fiatCurrencyPrice
    const formattedBalance = (balance || balance === 0) && balance
    return (
      <div className='coin-header'>
        <div className='coin-logo'>
          <img src={CoinIcon} className='logo' />
          <p className='logo-title'>{symbol}</p>
        </div>
        <div className='coin-details'>
          <h1>{name || <Loader className='loader' />}</h1>
          <div className='separator' />
          <p className='coin-balance'>My Balance: {formattedBalance || <Loader className='loader' />}</p>
          <div className='price-wrapper'>
            <h2>Current price:</h2>
            <p>{formattedPrice ? formattedPrice + ' CLN' : <Loader className='loader' />}</p>
          </div>
          <div className='price-wrapper'>
            <h2>Est. Denomination:</h2>
            <p>{fiatPrice ? <span>
              {formatEther(fiatPrice)} USD<img src={Info} className='info' onClick={this.loadModal} /></span> : <Loader className='loader' />}
            </p>
          </div>
        </div>
      </div>
    )
  }
}

CoinHeader.defaultProps = {
  token: {}
}

CoinHeader.propTypes = {
  token: PropTypes.object,
  fiat: PropTypes.object,
  balance: PropTypes.string,
  loadModal: PropTypes.func.isRequired
}
