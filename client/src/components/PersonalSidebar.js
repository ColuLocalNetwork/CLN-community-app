import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchTokens} from 'actions/accounts'

class PersonalSidebar extends Component {
  componentDidMount () {
    this.props.fetchTokens()
  }

  render = () => <div>PersonalSidebar</div>
}

const mapStateToProps = (state) => ({
  accountAddress: state.network.accountAddress
})

const mapDispatchToProps = {
  fetchTokens
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonalSidebar)
