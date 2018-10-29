import React, {Component} from 'react'
import {connect} from 'react-redux'
import {predictClnPrices} from 'actions/marketMaker'

class EconomicCalculator extends Component {
  componentDidMount () {
    setTimeout(() => {
      this.props.predictClnPrices('0xB8ef4FF697Df6586b9C73412904A6AB7b8dD727E', {
        initialClnReserve: 100,
        amountOfTransactions: 100,
        averageTransactionInUsd: 10,
        gainRatio: 0.1,
        iterations: 12
      })
    }, 3000)
  }

  render = () => (<div>hello</div>)
}

const mapDispatchToProps = {
  predictClnPrices
}

export default connect(null, mapDispatchToProps)(EconomicCalculator)
