import React, {Component} from 'react'
import { connect } from 'react-redux'
import {getNetworkType, checkAccountChanged} from 'actions/network'
import {onWeb3Ready} from 'services/web3'
import {isNetworkSupported} from 'utils/network'
import { WRONG_NETWORK_MODAL } from 'constants/uiConstants'

const withWeb3 = (WrappedComponent, options = {}) => {
  const Web3 = class extends Component {
    componentDidMount () {
      this.props.getNetworkType()
      onWeb3Ready.then(({web3}) => {
        if (web3.currentProvider.isMetaMask) {
          web3.currentProvider.publicConfigStore.on('update', this.props.checkAccountChanged)
        }
      })
    }

    componentWillReceiveProps = (nextProps) => {
      if (nextProps.networkType !== this.props.networkType && !isNetworkSupported(nextProps.networkType)) {
        this.props.loadModal(WRONG_NETWORK_MODAL)
      }
    }

    render () {
      if (this.props.networkType) {
        return <WrappedComponent {...this.props} />
      }
      return null
    }
  }

  const mapStateToProps = state => ({
    networkType: state.network.networkType
  })

  const mapDispatchToProps = {
    getNetworkType,
    checkAccountChanged
  }

  return connect(mapStateToProps, mapDispatchToProps)(Web3)
}

export default withWeb3
