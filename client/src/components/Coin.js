import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {formatEther} from 'utils/format'
import classNames from 'classnames'
import FontAwesome from 'react-fontawesome'
import CoinImage from 'images/Coin2.svg'
import Calculator from 'images/Calculator.svg'
import {PRICE_EXPLANATION_MODAL} from 'constants/uiConstants'

export default class Coin extends Component {
  constructor (props) {
    super(props)
    this.state = {
      toggleFooter: false
    }
  }
  loadModal = (e) => {
    this.props.loadModal(PRICE_EXPLANATION_MODAL, {token: this.props.token})
    e.stopPropagation()
  }
  render () {
    const fiatCurrencyPrice = this.props.fiat.USD && this.props.fiat.USD.price
    const coinHeaderClassStyle = classNames({
      'coin-header': true,
      'coin-show-footer': this.state.toggleFooter
    })
    return [
      <div className={coinHeaderClassStyle} >
        <div className='coin-logo'>
          <img src={CoinImage} className='logo-img' />
          <span className='symbol-text'>{this.props.token.symbol}</span>
        </div>
        <div className='coin-details'>
          <h3 className='coin-name'>{this.props.token.name}</h3>
          <p className='coin-total'>Total CC supply <span className='total-text'>
            {new Intl.NumberFormat('en-US', {
              style: 'decimal',
              minimumFractionDigits: 0
            }).format(this.props.token.totalSupply)}
          </span></p>
          <button className='btn-calculator'>
            <img src={Calculator} />
          </button>
          <div className='coin-status coin-status-active'>
            <span className='coin-status-indicator' /> <span className='coin-status-text'>open</span>
          </div>
        </div>
      </div>,
      <div className='coin-footer'>
        <div className='coin-content'>
          <div className='total-content'>CLN Reserved</div>
          <button className='btn-adding'>
            <FontAwesome name='plus' className='top-nav-issuance-plus' /> Add CLN
          </button>
        </div>
        <div className='coin-content'>
          <div>
            <span className='coin-currency-type'>USD</span>
            <span className='coin-currency'>{formatEther(fiatCurrencyPrice)}</span>
          </div>
          <div>
            <span className='coin-currency-type'>CLN</span>
            <span className='coin-currency'>0,00</span>
          </div>
        </div>
      </div>
    ]
  }
}

Coin.defaultProps = {
  token: {}
}

Coin.propTypes = {
  token: PropTypes.object,
  fiat: PropTypes.object,
  loadModal: PropTypes.func.isRequired
}
