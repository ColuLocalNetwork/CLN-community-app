import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {balanceOfToken} from 'actions/accounts'
import {fetchHomeToken, fetchForeignBridge, fetchHomeBridge, deployBridge, tranferToHome} from 'actions/bridge'
import {getBalances} from 'selectors/accounts'

class Bridge extends Component {
  componentDidMount () {
    this.props.balanceOfToken(this.props.homeTokenAddress, this.props.accountAddress, {
      networkBridge: 'home'
    })

    this.props.balanceOfToken(this.props.foreignTokenAddress, this.props.accountAddress, {
      networkBridge: 'foreign'
    })
  }

  render = () => <div>
    <div>Foreign Balance: {this.props.balances[this.props.foreignTokenAddress]}</div>
    <div>Home Balance: {this.props.balances[this.props.homeTokenAddress]}</div>
    <div><button onClick={() => this.props.tranferToHome(this.props.foreignTokenAddress, this.props.foreignBridgeAddress, '1000000000000000000')}>Transfer 1 token</button></div>
  </div>
}

Bridge.propTypes = {
  accountAddress: PropTypes.string,
  homeTokenAddress: PropTypes.string,
  foreignTokenAddress: PropTypes.string,
  networkType: PropTypes.string
}

class BridgeContainer extends Component {
  componentDidMount () {
    this.props.fetchHomeToken(this.props.foreignTokenAddress)
    this.props.fetchHomeBridge(this.props.foreignTokenAddress)
    this.props.fetchForeignBridge(this.props.foreignTokenAddress)
  }

  render = () => {
    if (this.props.foreignTokenAddress && this.props.homeTokenAddress) {
      return <Bridge
        {...this.props} />
    } else {
      return <div>
        <button onClick={() => this.props.deployBridge(this.props.foreignTokenAddress)}>Deploy bridge</button>
      </div>
    }
  }
}

const mapStateToProps = (state) => ({
  ...state.screens.bridge,
  balances: getBalances(state)
})

const mapDispatchToProps = {
  balanceOfToken,
  deployBridge,
  fetchHomeBridge,
  fetchHomeToken,
  fetchForeignBridge,
  tranferToHome
}

export default connect(mapStateToProps, mapDispatchToProps)(BridgeContainer)
