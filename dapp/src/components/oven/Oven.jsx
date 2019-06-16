import React, { Component } from 'react'
import CommunitiesList from 'components/oven/CommunitiesList'
import { connect } from 'react-redux'
import { fetchTokens, fetchTokensByOwner, fetchClnToken } from 'actions/token'
import { loadModal } from 'actions/ui'
import { getAccountAddress } from 'selectors/accounts'
import { getForeignNetwork } from 'selectors/network'
import TopNav from 'components/TopNav'
import ReactGA from 'services/ga'

class Oven extends Component {
  componentDidMount () {
    if (this.props.networkType !== 'fuse') {
      this.props.fetchClnToken()
    }
    if (this.props.account) {
      const { networkType } = this.props
      this.props.fetchTokensByOwner(networkType, this.props.account)
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props.account && !prevProps.account) {
      const { networkType } = this.props
      this.props.fetchTokensByOwner(networkType, this.props.account)
    }
  }

  showDashboard = (communityAddress) => {
    this.props.history.push(`/view/dashboard/${this.props.foreignNetwork}/${communityAddress}`)
    ReactGA.event({
      category: 'Dashboard',
      action: 'Click',
      label: 'dashboard'
    })
  }

  render = () => (
    <React.Fragment>
      <TopNav
        active
        history={this.props.history}
      />
      <CommunitiesList {...this.props} showDashboard={this.showDashboard} />
    </React.Fragment>
  )
}

const mapStateToProps = state => ({
  tokens: state.entities.tokens,
  metadata: state.entities.metadata,
  account: getAccountAddress(state),
  foreignNetwork: getForeignNetwork(state),
  networkType: state.network.networkType,
  ...state.screens.oven
})

const mapDispatchToProps = {
  fetchTokens,
  fetchTokensByOwner,
  loadModal,
  fetchClnToken

}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Oven)
