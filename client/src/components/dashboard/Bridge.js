import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {balanceOfToken} from 'actions/accounts'

class Bridge extends Component {
  componentDidMount () {
    this.props.balanceOfToken(this.props.homeAddress, this.props.accountAddress, {
      network: 'home'
    })

    this.props.balanceOfToken(this.props.foreignAddress, this.props.accountAddress, {
      network: 'foreign'
    })
  }

  render = () => null
}

Bridge.propTypes = {
  accountAddress: PropTypes.string,
  homeAddress: PropTypes.string,
  foreignAddress: PropTypes.string,
  networkType: PropTypes.string
}

class BridgeContainer extends Component {
  // componentDidMount () {
  //   this.props.foreignAddress
  // }
  render = () => this.props.foreignAddress && this.props.homeAddress && <Bridge
    foreignAddress={this.props.foreignAddress}
    homeAddress={this.props.homeAddress} />
}

const mapDispatchToProps = {
  balanceOfToken
}

export default connect(null, mapDispatchToProps)(BridgeContainer)
