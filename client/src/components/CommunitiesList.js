import React, { Component } from 'react'
import { connect } from 'react-redux'
import Community from './Community'
import {fetchCommunities} from 'actions/communities'
import InfiniteScroll from 'react-infinite-scroller'
import {loadModal, hideModal} from 'actions/ui'
import CoinIcon1 from 'images/Coin1.svg'
import CoinIcon2 from 'images/Coin2.svg'
import CoinIcon3 from 'images/Coin3.svg'
import { CALCULATOR_MODAL } from 'constants/uiConstants'

const PAGE_START = 1
const PAGE_SIZE = 10

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

  loadMore = (nextPage) => {
    if (this.props.addresses.length < nextPage * PAGE_SIZE) {
      this.props.fetchCommunities(nextPage)
    }
  }

  componentDidMount () {
    if (this.props.addresses.length < PAGE_SIZE) {
      this.props.fetchCommunities(PAGE_START)
    }
  }

  getScrollParent = () => this.myRef.current

  loadCalculator = (token, marketMaker) => this.props.loadModal(
    CALCULATOR_MODAL,
    {token: token, marketMaker: marketMaker, logo: this.renderCommunityLogo(token)}
  )

  renderCommunityLogo (token) {
    const communityLogos = {
      CoinIcon1: CoinIcon1,
      CoinIcon2: CoinIcon2,
      CoinIcon3: CoinIcon3
    }
    const logoImg = token.metadata && token.metadata.communityLogo ? token.metadata.communityLogo.replace('.svg', '') : 'noImage'
    let logoStr = ''
    Object.keys(communityLogos).forEach((key) => {
      if (key === logoImg) {
        logoStr = communityLogos[key]
      }
    })
    return logoStr
  }

  render () {
    const {addresses} = this.props
    return <div className='communities-list' ref={this.myRef}>
      <h2 className='communities-list-title'>Communities</h2>
      <div className='communities-list-container'>
        <InfiniteScroll
          initialLoad={false}
          pageStart={PAGE_START}
          loadMore={this.loadMore}
          hasMore={this.props.hasMore}
          useWindow={false}
          getScrollParent={this.getScrollParent}
        >
          {addresses.map(address => <Community
            key={address}
            handleCommunityClick={this.handleCommunityClick}
            token={this.props.tokens[address]}
            fiat={this.props.fiat}
            marketMaker={this.props.marketMaker[address]}
            renderCommunityLogo={this.renderCommunityLogo(this.props.tokens[address])}
            loadCalculator={() => this.loadCalculator(this.props.tokens[address], this.props.marketMaker[address])}
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
  fetchCommunities,
  loadModal,
  hideModal
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunitiesList)
