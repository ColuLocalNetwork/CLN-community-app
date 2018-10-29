import React, {Component} from 'react'
import {connect} from 'react-redux'
import {predictClnPrices} from 'actions/marketMaker'

class EconomicCalculator extends Component {
  componentDidMount () {
    setTimeout(() => {
      this.props.predictClnPrices('0x245Cf01FeCAA32AB0566c318D1f28Df91CaF7865', {
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
