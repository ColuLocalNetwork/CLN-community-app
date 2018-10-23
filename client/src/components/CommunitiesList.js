import React, { Component } from 'react'
import classNames from 'classnames'
import {loadModal} from 'actions/ui'
import { connect } from 'react-redux'
import Community from './Community'
import {getCommunities, getMarketMaker} from 'selectors/communities'
import {fetchCommunities} from 'actions/communities'
import find from 'lodash/find'
import sortBy from 'lodash/sortBy'
import FontAwesome from 'react-fontawesome'

class CommunitiesList extends Component {
  state = {
    toggleFooter: false,
    currentPage: 1,
    selectedCommunityAddress: null
  }

  // componentDidMount () {
  //   onWeb3Ready.then(({web3}) => {
  //     debugger
  //     if (web3.currentProvider.isMetaMask) {
  //       this.props.fetchCommunities(this.state.currentPage)
  //     }
  //   })
  // }

  handleCommunityClick = (address) => {
    this.setState({
      selectedCommunityAddress: address
    })
  }

  render () {
    const {addresses} = this.props

    const communitiesListStyle = classNames({
      'communities-list': true,
      'open-mobile': !!this.props.selectedCommunityAddress
    })
    return <div className={communitiesListStyle} ref='CommunitiesList'>
      <h2 className='communities-list-title'>Communities</h2>
      <div className='communities-list-container'>
        {addresses.map((address, i) => {
          const coinWrapperStyle = classNames({
            'coin-wrapper': true,
            'coin-show-footer': this.state.toggleFooter && this.state.activeCoin === i
          })
          return <div className='list-item' key={i} >
            <div className={coinWrapperStyle} onClick={() => this.setState({toggleFooter: true, activeCoin: i})}>
              <Community
                handleCommunityClick={this.handleCommunityClick}
                token={this.props.tokens[address]}
                fiat={this.props.fiat}
                loadModal={this.props.loadModal}
                marketMaker={this.props.marketMaker[address]}
              />
            </div>
            <div className='coin-footer-close' onClick={() => this.setState({toggleFooter: false, activeCoin: ''})}>
              <FontAwesome name='times-circle' /> Close
            </div>
          </div>
        })}
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
  loadModal,
  fetchCommunities
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunitiesList)
