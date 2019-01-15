import React, {Component} from 'react'
import CommunitiesList from 'components/oven/CommunitiesList'
import { connect } from 'react-redux'
import {fetchCommunities, fetchCommunitiesByOwner} from 'actions/communities'
import {loadModal} from 'actions/ui'
import {getAccountAddress} from 'selectors/accounts'
import TopNav from 'components/TopNav'

class Oven extends Component {
  componentDidUpdate (prevProps) {
    if (this.props.account && !prevProps.account) {
      this.props.fetchCommunitiesByOwner(this.props.account)
    }
  }

  render = () => (
    <div>
      <TopNav
        active
        history={this.props.history}
      />
      <CommunitiesList {...this.props} />
    </div>
  )
}

const mapStateToProps = state => ({
  tokens: state.tokens,
  ...state.screens.oven,
  account: getAccountAddress(state)
})

const mapDispatchToProps = {
  fetchCommunities,
  fetchCommunitiesByOwner,
  loadModal
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Oven)
