import React, {Component} from 'react'
import { connect } from 'react-redux'
import {fetchClnToken} from 'actions/communities'
import {fetchTokenQuote} from 'actions/fiat'

class App extends Component {
  componentDidMount () {
    this.props.fetchClnToken()
    this.props.fetchTokenQuote('CLN', 'USD')
  }

  render = () => <div />
}

const mapDispatchToProps = {
  fetchTokenQuote,
  fetchClnToken
}

export default connect(null, mapDispatchToProps)(App)
