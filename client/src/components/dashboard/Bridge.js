import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {balanceOfToken} from 'actions/balanceOfToken'

class Bridge extends Component {
  componentDidMount () {
    this.props.balanceOfToken(this.props.homeAddress, {
      network: 'home'
    })

    this.props.balanceOfToken(this.props.foreignAddress, {
      network: 'foreign'
    })
  }

  render = () => null
}

Bridge.propTypes = {
  homeAddress: PropTypes.string,
  foreignAddress: PropTypes.string,
  networkType: PropTypes.string
}

const mapDispatchToProps = {
  balanceOfToken
}

export default connect(null, mapDispatchToProps)(Bridge)
