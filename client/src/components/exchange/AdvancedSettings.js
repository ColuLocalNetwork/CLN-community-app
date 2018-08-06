import React, {Component} from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { BigNumber } from 'bignumber.js'
import trim from 'lodash/trim'

import {roundToWei} from './utils'
import DownArrow from 'images/down-arrow.png'
import TextInput from 'components/TextInput'

const calculatePriceLimit = (pricePercentage, price) => (pricePercentage.plus(1)).multipliedBy(price)
const calculateMinimum = (pricePercentage, relevantAmount) => relevantAmount.div((pricePercentage.plus(1)))

const toPercentage = (value) => trim(value) === '' ? value : new BigNumber(value).multipliedBy(100).toString()

class AdvancedSettings extends Component {
  handlePricePercentage = (event) => {
    const value = event.target.value
    if (trim(value) === '') {
      this.nulliFySettings()
      return
    }

    const pricePercentage = new BigNumber(value).div(100)
    const minimum = calculateMinimum(pricePercentage, this.props.relevantAmount)
    const priceLimit = calculatePriceLimit(pricePercentage, this.props.price())

    this.props.setSettings({
      minimum: roundToWei(minimum).toString(),
      pricePercentage: pricePercentage.toString(),
      priceLimit: roundToWei(priceLimit).toString()
    })
  }

  handlePriceLimit = (event) => {
    const value = event.target.value
    if (trim(value) === '') {
      this.nulliFySettings()
      return
    }

    const priceLimit = new BigNumber(value)
    const pricePercentage = priceLimit.div(this.props.price()).minus(1)

    const minimum = calculateMinimum(pricePercentage, this.props.relevantAmount)

    this.props.setSettings({
      minimum: roundToWei(minimum).toString(),
      pricePercentage: roundToWei(pricePercentage).toString(),
      priceLimit: value
    })
  }

  handleMinimum = (event) => {
    const value = event.target.value
    if (trim(value) === '') {
      this.nulliFySettings()
      return
    }

    const minimum = new BigNumber(value)
    const pricePercentage = this.props.relevantAmount.div(minimum).minus(1)
    const priceLimit = calculatePriceLimit(pricePercentage, this.props.price())

    this.props.setSettings({
      minimum: value,
      pricePercentage: roundToWei(pricePercentage).toString(),
      priceLimit: roundToWei(priceLimit).toString()
    })
  }

  nulliFySettings = () => this.props.setSettings({
    minimum: '',
    pricePercentage: '',
    priceLimit: ''
  })

  componentWillReceiveProps (nextProps) {
    if (!this.props.relevantAmount.isEqualTo(nextProps.relevantAmount)) {
      if (trim(nextProps.pricePercentage) === '') {
        return
      }

      if (nextProps.relevantAmount.isEqualTo(0)) {
        this.props.setSettings({
          minimum: '',
          priceLimit: ''
        })
        return
      }
      const pricePercentage = new BigNumber(nextProps.pricePercentage)
      const minimum = calculateMinimum(pricePercentage, nextProps.relevantAmount)
      const priceLimit = calculatePriceLimit(pricePercentage, this.props.price())

      this.props.setSettings({
        minimum: roundToWei(minimum).toString(),
        priceLimit: roundToWei(priceLimit).toString()
      })
    }
  }

  render = () => {
    const {isBuy} = this.props
    const {symbol} = this.props.community

    const advancedClass = classNames({
      'advanced-settings': true,
      'open': this.props.isOpen
    })

    return (
      <div className={advancedClass}>
        <div className='advanced-header'>
          <h5 onClick={this.props.handleToggle}>Advanced settings</h5>
          <img onClick={this.props.handleToggle} src={DownArrow} />
        </div>
        <TextInput id='minimum'
          type='number'
          label='MINIMAL ACCEPTABLE AMOUNT'
          placeholder={`Enter minimal amount of ${isBuy ? symbol : 'cln'}`}
          onChange={this.handleMinimum}
          value={this.props.minimum}
        />
        <div className='minimum-coin-symbol'>{isBuy ? symbol : 'CLN'}</div>
        <TextInput id='price-change'
          type='number'
          label={`${symbol} PRICE CHANGE`}
          placeholder='Enter price change in %'
          value={toPercentage(this.props.pricePercentage)}
          onChange={this.handlePricePercentage}
        />
        <div className='price-change-percent'>%</div>
        <TextInput id='price-limit'
          type='number'
          label={`${symbol} PRICE LIMIT`}
          placeholder={`Enter price limit for ${symbol}`}
          value={this.props.priceLimit}
          onChange={this.handlePriceLimit}
        />

        <div className='price-limit-cln'>CLN</div>
        <p className='annotation'>{`The transaction will fail if the price of 1 ${symbol} is ${(isBuy ? 'higher' : 'lower')} than ${(this.props.priceLimit)} CLN`}</p>
      </div>
    )
  }
}

AdvancedSettings.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isBuy: PropTypes.bool.isRequired,
  community: PropTypes.object.isRequired,
  handleToggle: PropTypes.func.isRequired,
  minimum: PropTypes.string.isRequired,
  pricePercentage: PropTypes.string.isRequired,
  priceLimit: PropTypes.string.isRequired,
  relevantAmount: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  price: PropTypes.func.isRequired,
  setSettings: PropTypes.func.isRequired
}

export default AdvancedSettings