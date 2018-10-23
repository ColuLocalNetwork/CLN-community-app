import React, { Component } from 'react'
import classNames from 'classnames'
import {loadModal} from 'actions/ui'
import { connect } from 'react-redux'
import Community from './Community'
import {fetchCommunities} from 'actions/communities'
import FontAwesome from 'react-fontawesome'

class CommunitiesList extends Component {
  state = {
    toggleFooter: false,
    currentPage: 1,
    selectedCommunityAddress: null
  }

  handleCommunityClick = (address) => {
    this.setState({
      selectedCommunityAddress: address
    })
  }

  loadMore = () => {
    this.props.fetchCommunities(this.state.currentPage + 1)
    this.setState({
      currentPage: this.state.currentPage + 1
    })
  }

  handleClose = () => this.setState({selectedCommunityAddress: null})

  render () {
    const {addresses} = this.props
    return <div className='communities-list'>
      <h2 className='communities-list-title'>Communities</h2>
      <div className='communities-list-container'>
        {addresses.map((address, i) => {
          return <Community
            handleCommunityClick={this.handleCommunityClick}
            token={this.props.tokens[address]}
            fiat={this.props.fiat}
            marketMaker={this.props.marketMaker[address]}
            selectedCommunityAddress={this.state.selectedCommunityAddress}
          />
        })}
      </div>
      <button onClick={this.loadMore}>More</button>
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
