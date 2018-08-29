import React, { Component } from 'react'
import {formatEther} from 'utils/format'
import Loader from 'components/Loader'

export default class CoinHeader extends Component {
  render () {
    const { price, coinImage, name, balance, showBalance } = this.props
    const formattedPrice = (price || price === 0) && formatEther(price)
    const formattedBalance = (balance || balance === 0) && formatEther(balance)
    return (
      <div className='coin-header'>
        {coinImage ? <img src={coinImage} /> : <Loader className='loader image' />}
        <div className='coin-details'>
          <h1>
            {name || <Loader className='loader' />}
            {showBalance && <p className='coin-balance'>{formattedBalance ? formattedBalance : <Loader className='loader' />}</p>}
          </h1>
          <div className='separator' />
          <div className='price-wrapper'>
            <h2>Current price:</h2>
            <p>{formattedPrice ? formattedPrice + ' CLN' : <Loader className='loader' />}</p>
          </div>
        </div>
      </div>
    )
  }
}
