import React, {Component, Fragment} from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import trim from 'lodash/trim'
import identity from 'lodash/identity'
import web3Utils from 'web3-utils'
import { BigNumber } from 'bignumber.js'

import AdvancedSettings from './AdvancedSettings'
import TextInput from 'components/TextInput'
import Loader from 'components/Loader'
import Arrows from 'images/arrows.png'
import Info from 'images/info.png'
import * as utils from './utils.js'

const DEFAULT_PRICE_CHANGE = 0.02

const AmountTextInput = (props) => {
  const {symbol, error, isLoading} = props
  return (
    <Fragment>
      <TextInput
        className={classNames({'buy-sell-input': true, 'error': !!error})}
        placeholder={isLoading ? '' : `Enter amount in ${symbol}`}
        error={error}
        value={isLoading ? '' : props.getValue()}
        onChange={props.handleInput}
      />
      {isLoading ? <Loader className='loader input' /> : null}
      <div className='input-coin-symbol'>{symbol}</div>
    </Fragment>
  )
}

AmountTextInput.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  symbol: PropTypes.string.isRequired,
  handleInput: PropTypes.func.isRequired,
  error: PropTypes.string
}

class BuySellAmounts extends Component {
  constructor (props) {
    super(props)
    this.state = {
      inputField: props.inputField || '',
      advanced: false,
      cln: props.cln || '',
      cc: props.cc || '',
      minimum: props.minimum || '',
      priceLimit: props.priceLimit || '',
      pricePercentage: props.pricePercentage || DEFAULT_PRICE_CHANGE
    }
  }

  next = () => {
    const { minimum, priceLimit, pricePercentage, inputField } = this.state
    const { isBuy, uiActions } = this.props

    uiActions.setModalProps({
      buyStage: 2,
      cln: this.cln(),
      cc: this.cc(),
      inputField,
      isBuy,
      minimum,
      priceLimit,
      pricePercentage,
      quotePair: this.props.quotePair
    })
  }

  askForClnQuote = (amount) => {
    const {isBuy, community, marketMakerActions} = this.props
    const amountInWei = web3Utils.toWei(amount.toString())
    if (isBuy) {
      marketMakerActions.buyQuote(community.address, amountInWei)
    } else {
      marketMakerActions.invertSellQuote(community.address, amountInWei)
    }
  }

  askForCcQuote = (amount) => {
    const amountInWei = web3Utils.toWei(amount.toString())
    const {isBuy, community, marketMakerActions} = this.props
    if (isBuy) {
      marketMakerActions.invertBuyQuote(community.address, amountInWei)
    } else {
      marketMakerActions.sellQuote(community.address, amountInWei)
    }
  }

  resetForm = () => this.setState({
    cc: '',
    cln: '',
    inputField: '',
    error: ''
  })

  resetAdvancedSettingsForm = () => this.setState({
    pricePercentage: DEFAULT_PRICE_CHANGE
  })

  handleClnInput = (event) => {
    const amount = event.target.value

    if (trim(amount) === '') {
      return this.resetForm()
    }

    const amountInWei = new BigNumber(amount.toString()).multipliedBy(1e18)
    if (amountInWei.isNaN()) {
      return
    }

    if (amountInWei.isNegative()) {
      return
    }

    if (amountInWei.decimalPlaces() > 0) {
      this.setState({
        error: 'Precision too hight'
      })
      return
    }

    this.setState({
      cln: amount,
      cc: '',
      inputField: 'cln',
      error: (this.props.isBuy && amountInWei.isGreaterThan(this.props.clnBalance)) ? 'Insufficient Funds' : ''
    })
    if (trim(amount)) {
      this.askForClnQuote(amount)
    }
  }

  handleCcInput = (event) => {
    const amount = event.target.value

    if (trim(amount) === '') {
      return this.resetForm()
    }

    const amountInWei = new BigNumber(amount.toString()).multipliedBy(1e18)
    if (amountInWei.isNaN()) {
      return
    }

    if (amountInWei.isNegative()) {
      return
    }

    if (amountInWei.decimalPlaces() > 0) {
      this.setState({
        error: 'Precision too hight'
      })
      return
    }

    this.setState({
      cc: amount,
      inputField: 'cc',
      error: (!this.props.isBuy && amountInWei.isGreaterThan(this.props.ccBalance)) ? 'Insufficient Funds' : ''
    })

    this.askForCcQuote(amount)
  }

  handleClickMax = (handle, balance) => {
    handle({
      target: {
        value: web3Utils.fromWei(balance.toString())
      }
    })
  }

  handleClnClickMax = () => this.handleClickMax(this.handleClnInput, this.props.clnBalance)

  handleCcClickMax = () => this.handleClickMax(this.handleCcInput, this.props.ccBalance)

  price = () => {
    return this.props.quotePair.price
      ? new BigNumber(this.props.quotePair.price.toString())
      : new BigNumber(this.props.community.currentPrice.toString())
  }

  cln = (formatter = identity) => this.state.inputField !== 'cc' ? this.state.cln : (
    this.props.isBuy ? formatter(new BigNumber(this.props.quotePair.inAmount.toString()).div(1e18), this.props.isBuy)
      : formatter(new BigNumber(this.props.quotePair.outAmount.toString()).div(1e18), this.props.isBuy)
  )

  cc = (formatter = identity) => this.state.inputField !== 'cln' ? this.state.cc : (
    this.props.isBuy ? formatter(new BigNumber(this.props.quotePair.outAmount.toString()).div(1e18), this.props.isBuy)
      : formatter(new BigNumber(this.props.quotePair.inAmount.toString()).div(1e18), this.props.isBuy)
  )

  slippage = () => utils.roundUp(new BigNumber(this.props.quotePair.slippage).multipliedBy(100))

  amountToReceive = () => {
    if (this.props.isFetching) {
      return BigNumber(0)
    }
    const value = this.props.isBuy ? this.cc() : this.cln()
    if (trim(value) === '') {
      return BigNumber(0)
    } else {
      return BigNumber(value)
    }
  }

  handleChangeToSellTab = () => {
    if (this.props.isBuy) {
      this.handleChangeTab()
    }
  }

  handleChangeToBuyTab = () => {
    if (!this.props.isBuy) {
      this.handleChangeTab()
    }
  }

  handleChangeTab = () => {
    this.props.uiActions.setModalProps({
      isBuy: !this.props.isBuy
    })

    this.resetForm()
    this.resetAdvancedSettingsForm()
  }

  handleAdvanced = () => {
    this.setState({ advanced: !this.state.advanced })
  }

  setMinimum = (minimum) => this.setState({minimum})

  setAdvancedSettings = (props) => this.setState(props)

  renderClickMax = () => {
    const maxAmountClass = classNames({
      'max-amount': true,
      'error': this.state.error
    })

    if (this.props.isBuy) {
      const clnBalance = new BigNumber(web3Utils.fromWei(this.props.clnBalance)).toFormat(utils.ROUND_PRECISION, BigNumber.ROUND_DOWN)
      return <div className={maxAmountClass} onClick={this.handleClnClickMax}>{`Max: ${clnBalance} CLN`}</div>
    } else {
      const ccBalance = new BigNumber(web3Utils.fromWei(this.props.ccBalance)).toFormat(utils.ROUND_PRECISION, BigNumber.ROUND_DOWN)
      const ccSymbol = this.props.community.symbol
      return <div className={maxAmountClass} onClick={this.handleCcClickMax}>{`Max: ${ccBalance} ${ccSymbol}`}</div>
    }
  }

  render () {
    const { isBuy, community, isFetching } = this.props
    const { error, inputField } = this.state
    const ccSymbol = community.symbol

    const buyTabClass = classNames({
      'buy-tab': true,
      'active': isBuy
    })
    const sellTabClass = classNames({
      'buy-tab': true,
      'active': !isBuy
    })

    return (
      <div>
        <div className='buy-sell-top'>
          <div className='buy-sell-tab'>
            <div className={buyTabClass} onClick={this.handleChangeToBuyTab}>BUY</div>
            <div className={sellTabClass} onClick={this.handleChangeToSellTab}>SELL</div>
          </div>
          {
            isBuy ? <AmountTextInput
              isLoading={isFetching && inputField !== 'cln'}
              symbol='CLN'
              getValue={this.cln.bind(null, utils.clnFormatter)}
              handleInput={this.handleClnInput}
              error={error} />
              : <AmountTextInput
                isLoading={isFetching && inputField !== 'cc'}
                symbol={community.symbol}
                getValue={this.cc.bind(null, utils.ccFormatter)}
                handleInput={this.handleCcInput}
                error={error}
              />
          }
          {this.renderClickMax()}
        </div>
        <div className='arrows'><img src={Arrows} /></div>
        <div className='buy-sell-bottom'>
          <div className='info-price'>
            <div className='cc-to-cln'>{`1 ${ccSymbol} = ${utils.roundUp(this.price())} CLN`}</div>
            {this.slippage() ? <div>PRICE SLIPPAGE<img src={Info} />{`${this.slippage()}%`}</div> : null}
          </div>
          {
            !isBuy ? <AmountTextInput
              isLoading={isFetching && inputField !== 'cln'}
              symbol='CLN'
              getValue={this.cln.bind(null, utils.clnFormatter, isBuy)}
              handleInput={this.handleClnInput} />
              : <AmountTextInput
                isLoading={isFetching && inputField !== 'cc'}
                symbol={community.symbol}
                getValue={this.cc.bind(null, utils.ccFormatter, isBuy)}
                handleInput={this.handleCcInput}
              />
          }
          <AdvancedSettings
            isOpen={this.state.advanced}
            handleToggle={this.handleAdvanced}
            isBuy={this.props.isBuy}
            community={this.props.community}
            minimum={this.state.minimum}
            priceLimit={this.state.priceLimit}
            pricePercentage={this.state.pricePercentage}
            setSettings={this.setAdvancedSettings}
            price={this.price}
            amountToReceive={this.amountToReceive()}
            isFetching={this.props.isFetching} />
          <button disabled={error || isFetching || !this.cc() || !this.cln()} onClick={this.next}>{isBuy ? `Buy ${ccSymbol}` : `Sell ${ccSymbol}`}</button>
        </div>
      </div>
    )
  }
}

BuySellAmounts.defaultProps = {
  isFetching: false,
  quotePair: {
    slippage: 0,
    inAmount: 0,
    outAmount: 0
  }
}

export default BuySellAmounts