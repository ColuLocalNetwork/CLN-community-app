import React, {Component} from 'react'
import Modal from 'components/Modal'

class PriceExplanationModal extends Component {
  render () {
    return (
      <Modal className='fullscreen' onClose={this.props.hideModal}>
        <div className='transaction-in-progress legal-explanation'>
          <h4>LEGAL DISCLAIMER</h4>
          <div className='summary-prices-wrapper'>
            <p>The calculation of the estimated denomination of the Tel Aviv Coin in USD is based on:</p>
            <p>
              (a) The price of Tel Aviv Coin in CLN as determined by the Market Maker Smart Contract
            </p>
            <p>
              (b) Conversion rate of CLN to Ether to USD, according to CoinMarketCap
            </p>
            <p>
              Tel Aviv Coins are NOT convertible into Fiat within or from the Colu wallet, and Colu does not warrant nor represent that they will be in the future. Furthermore, Colu does not represent that the estimated denomination of the Tel Aviv Coins is the market value for Tel Aviv Coins, or that they carry any value at all.
            </p>
          </div>
        </div>
      </Modal>
    )
  }
}

export default PriceExplanationModal
