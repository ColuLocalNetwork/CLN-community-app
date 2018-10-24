import React, { Component } from 'react'
import { connect } from 'react-redux'
import Community from './Community'
import {fetchCommunities} from 'actions/communities'
import InfiniteScroll from 'react-infinite-scroller'

class CommunitiesList extends Component {
  state = {
    selectedCommunityAddress: null
  }

  constructor (props) {
    super(props)
    this.myRef = React.createRef()
  }

  handleCommunityClick = (address) => {
    this.setState({
      selectedCommunityAddress: address
    })
  }

  loadMore = (currentPage) => {
    this.props.fetchCommunities(currentPage + 1)
  }

  getScrollParent = () => this.myRef.current

  render () {
    const {addresses} = this.props
    return <div className='communities-list' ref={this.myRef}>
      <h2 className='communities-list-title'>Communities</h2>
      <div className='communities-list-container'>
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={this.loadMore}
          hasMore={this.props.loadMore}
          useWindow={false}
          getScrollParent={this.getScrollParent}
        >
          {addresses.map((address, i) => <Community
            handleCommunityClick={this.handleCommunityClick}
            token={this.props.tokens[address]}
            fiat={this.props.fiat}
            marketMaker={this.props.marketMaker[address]}
            selectedCommunityAddress={this.state.selectedCommunityAddress}
          />
          )}
        </InfiniteScroll>
      </div>
    </div>
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
