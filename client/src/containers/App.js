import React, {Component} from 'react'
import { connect } from 'react-redux'
import TopNav from 'components/TopNav'
import Oven from 'components/oven/Oven'
import {fetchClnToken} from 'actions/communities'
import {fetchTokenQuote} from 'actions/fiat'
import 'scss/styles.scss'

class App extends Component {
  state = {
    welcomeDone: false
  }

  componentDidMount () {
    this.props.fetchClnToken()
    this.props.fetchTokenQuote('CLN', 'USD')
  }

  render = () => (<div>
    <TopNav
      active={this.state.welcomeDone}
      history={this.props.history}
    />
    <Oven history={this.props.history} />
  </div>)
}

const mapDispatchToProps = {
  fetchTokenQuote,
  fetchClnToken
}

export default connect(null, mapDispatchToProps)(App)
