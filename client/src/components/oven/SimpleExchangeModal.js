import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {BigNumber} from 'bignumber.js'

import Modal from 'components/Modal'
import {formatWei} from 'utils/format'
import CommunityLogo from 'components/elements/CommunityLogo'
import TextInput from 'components/elements/TextInput'
import {connect} from 'react-redux'
import {buyQuote, buyCc} from 'actions/marketMaker'

class SimpleExchangeModal extends Component {
  state = {
    clnAmount: 0
  }

  handleClnChange = (event) => {
    const clnAmount = event.target.value
    this.setState({clnAmount})
    const amountInWei = new BigNumber(clnAmount.toString()).multipliedBy(1e18)

    this.props.buyQuote(this.props.token.address, amountInWei)
  }

  getTokenAmount = () => {
    if (this.props.quotePair) {
      return formatWei(this.props.quotePair.outAmount)
    }
  }

  handleExchange = () => {
    const amountInWei = new BigNumber(this.state.clnAmount.toString()).multipliedBy(1e18)
    this.props.buyCc(this.props.token.address, amountInWei)
  }

  isExchangeDisabled = () => !this.state.clnAmount || this.props.transactionHash

  getStatus = () => this.props.receipt ? 'SUCCESS'
    : (this.props.transactionHash ? 'PENDING' : 'EXCHANGE')

  render = () => (
    <Modal className='exchange-modal' onClose={this.props.hideModal}>
      <div className='exchange-modal-up'>
        <div className='coin-wrapper'>
          <CommunityLogo token={this.props.token} />
        </div>
        <div>Total Supply: {formatWei(this.props.token.totalSupply, 0)}</div>
        <div>CLN reserve: {formatWei(this.props.marketMaker.clnReserve, 0)}</div>
      </div>
      <div className='exchange-modal-down'>
        <div className='exchange-modal-middle'>
          <TextInput id='price-change'
            type='string'
            label='CLN'
            placeholder='CLN amount'
            onChange={this.handleClnChange}
          />
          <div className='price-change-percent'>%</div>
          <TextInput id='price-limit'
            type='string'
            label={this.props.token.symbol}
            placeholder={`${this.props.token.symbol} amount`}
            value={this.getTokenAmount()}
            disabled
          />
          <button className='btn-exchange' onClick={this.handleExchange} disabled={this.isExchangeDisabled()}>
            {this.getStatus()}
          </button>
        </div>
      </div>
    </Modal>
  )
}

SimpleExchangeModal.propTypes = {
  token: PropTypes.object.isRequired,
  marketMaker: PropTypes.object.isRequired
}

const mapDispatchToProps = {
  buyQuote,
  buyCc
}

export default connect(null, mapDispatchToProps)(SimpleExchangeModal)
