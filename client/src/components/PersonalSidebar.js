import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchTokens} from 'actions/accounts'

class PersonalSidebar extends Component {
  componentWillReceiveProps = ({accountAddress}) =>
    accountAddress && !this.props.accountAddress && this.props.fetchTokens(accountAddress)

  render = () => <div>PersonalSidebar</div>
}

const mapStateToProps = (state) => ({
  accountAddress: state.network.accountAddress
})

const mapDispatchToProps = {
  fetchTokens
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonalSidebar)
