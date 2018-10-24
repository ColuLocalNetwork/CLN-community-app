import React, { Component } from 'react'
import { connect } from 'react-redux'
import Community from './Community'
import {fetchCommunities} from 'actions/communities'
import InfiniteScroll from 'react-infinite-scroller'

class CommunitiesList extends Component {
  state = {
    toggleFooter: false,
    selectedCommunityAddress: null
  }

  handleCommunityClick = (address) => {
    this.setState({
      selectedCommunityAddress: address
    })
  }

  loadMore = (currentPage) => {
    this.props.fetchCommunities(currentPage + 1)
  }

  render () {
    const {addresses} = this.props
    return <InfiniteScroll
      initialLoad={false}
      pageStart={0}
      loadMore={this.loadMore}
      hasMore={this.props.loadMore}
    >
      <div className='communities-list'>
        <h2 className='communities-list-title'>Communities</h2>
        <div className='communities-list-container'>
          {addresses.map((address, i) => <Community
            handleCommunityClick={this.handleCommunityClick}
            token={this.props.tokens[address]}
            fiat={this.props.fiat}
            marketMaker={this.props.marketMaker[address]}
            selectedCommunityAddress={this.state.selectedCommunityAddress}
          />
          )}
        </div>
      </div>
    </InfiniteScroll>
  }
};

const mapStateToProps = state => {
  return {
    tokens: state.tokens,
    marketMaker: state.marketMaker,
    fiat: state.fiat,
    ...state.screens.oven
  }
}

const mapDispatchToProps = {
  fetchCommunities
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunitiesList)
