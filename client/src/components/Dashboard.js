import React, { Component } from 'react'
import ClnIcon from 'images/cln.png'
import Calculator from 'images/calculator-Icon.svg'
import { connect } from 'react-redux'
import {fetchDashboardStatistics} from 'actions/communities'
import { BigNumber } from 'bignumber.js'
import classNames from 'classnames'
import FontAwesome from 'react-fontawesome'
import CommunityLogo from 'components/elements/CommunityLogo'
import {formatEther, formatWei} from 'utils/format'
import {loadModal} from 'actions/ui'
import {SIMPLE_EXCHANGE_MODAL} from 'constants/uiConstants'

class Dashboard extends Component {
  componentDidMount () {
    this.props.fetchDashboardStatistics(this.props.match.params.address)
  }

  handleAddCln = (token, marketMaker) => {
    console.log('----handleAddCln------')
    console.log(token)
    this.props.loadModal(SIMPLE_EXCHANGE_MODAL, {tokenAddress: this.props.match.params.address})
  }

  render () {
    console.log('----dashboard------')
    console.log(this.props)
    const token = {...this.props.dashboard, ...this.props.tokens[this.props.match.params.address], address: this.props.match.params.address}
    const marketMaker = {
      isOpenForPublic: this.props.marketMaker && this.props.marketMaker[this.props.match.params.address] && this.props.marketMaker[this.props.match.params.address].isOpenForPublic ? this.props.marketMaker[this.props.match.params.address].isOpenForPublic : false,
      currentPrice: this.props.marketMaker && this.props.marketMaker[this.props.match.params.address] && this.props.marketMaker[this.props.match.params.address].currentPrice ? this.props.marketMaker[this.props.match.params.address].currentPrice : new BigNumber(0),
      clnReserve: this.props.marketMaker && this.props.marketMaker[this.props.match.params.address] && this.props.marketMaker[this.props.match.params.address].clnReserve ? this.props.marketMaker[this.props.match.params.address].clnReserve : new BigNumber(0)
    }
    const coinStatusClassStyle = classNames({
      'coin-status': true,
      'coin-status-active': marketMaker.isOpenForPublic,
      'coin-status-close': !marketMaker.isOpenForPublic
    })
    console.log('----token------')
    console.log(token)
    return (
      <div className='dashboard-content'>
        <div className='dashboard-header'>
          <div className='dashboard-logo'>
            <a href='https://cln.network/' target='_blank'><img src={ClnIcon} /></a>
          </div>
        </div>
        <div className='dashboard-container'>
          <div className='dashboard-sidebar'>
            <CommunityLogo token={token} />
            {this.props.dashboard && this.props.dashboard.name
              ? <h3 className='dashboard-title'>{this.props.dashboard.name}</h3>
              : null}
            <div className={coinStatusClassStyle}>
              <span className='coin-status-indicator' />
              <span className='coin-status-text' onClick={this.openMarket}>
                {marketMaker.isOpenForPublic ? 'open' : 'closed'}
              </span>
            </div>
            <button onClick={() => this.handleAddCln(token, marketMaker)} className='btn-adding big-adding-btn'>
              <FontAwesome name='plus' className='top-nav-issuance-plus' /> Add CLN
            </button>
            <div className='coin-content'>
              <div className='coin-content-type'>
                <span className='coin-currency-type'>CLN</span>
                <span className='coin-currency'>{formatEther(marketMaker.currentPrice)}</span>
              </div>
              <div className='coin-content-type'>
                <span className='coin-currency-type'>USD</span>
                <span className='coin-currency'>{formatEther(marketMaker.currentPrice.multipliedBy(this.props.fiat.USD && this.props.fiat.USD.price))}</span>
              </div>
            </div>
          </div>
          <div className='dashboard-information'>
            <div className='dashboard-information-header'>
              <div>
                <p className='dashboard-information-top'>
                  <span className='dashboard-information-logo'><img src={ClnIcon} /></span>
                  <span className='dashboard-information-text'>Total supply</span>
                </p>
                <p className='dashboard-information-big-count'>
                  {this.props.dashboard && this.props.dashboard.totalSupply ? formatWei(this.props.dashboard.totalSupply, 0) : null}
                  <span>{token.symbol}</span>
                </p>
              </div>
              <div>
                <p className='dashboard-information-top'>
                  <span className='dashboard-information-logo logo-inverse'><img src={Calculator} /></span>
                  <span className='dashboard-information-text'>Circulation</span>
                </p>
                <p className='dashboard-information-big-count'>
                  315,00
                  <span>{token.symbol}</span>
                </p>
              </div>
            </div>
            <div className='dashboard-information-content'>
              <div className='dashboard-information-content-activity'>
                <p className='dashboard-information-small-text'>
                  <span>User</span> Activity
                </p>
                <p className='dashboard-information-period'>
                  Monthly <FontAwesome name='caret-down' />
                </p>
              </div>
              <div className='dashboard-information-content-number'>
                <p className='dashboard-information-small-text'>
                  Number of transactions
                </p>
                <p className='dashboard-information-number'>
                  300
                </p>
              </div>
              <div className='dashboard-information-content-number'>
                <p className='dashboard-information-small-text'>
                  Transactions volume
                </p>
                <p className='dashboard-information-number'>
                  300
                </p>
              </div>
            </div>
            <div className='dashboard-information-content'>
              <div className='dashboard-information-content-activity'>
                <p className='dashboard-information-small-text'>
                  <span>Admin</span> Activity
                </p>
                <p className='dashboard-information-period'>
                  Monthly <FontAwesome name='caret-down' />
                </p>
              </div>
              <div className='dashboard-information-content-number'>
                <p className='dashboard-information-small-text'>
                  Number of transactions
                </p>
                <p className='dashboard-information-number'>
                  300
                </p>
              </div>
              <div className='dashboard-information-content-number'>
                <p className='dashboard-information-small-text'>
                  Transactions volume
                </p>
                <p className='dashboard-information-number'>
                  300
                </p>
              </div>
            </div>
            <div className='dashboard-information-footer'>
              <p className='dashboard-information-small-text'>
                <span>Asset ID</span> {this.props.match.params.address}
              </p>
              <p className='dashboard-information-period'>
                copy
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  tokens: state.tokens,
  fiat: state.fiat,
  marketMaker: state.marketMaker,
  dashboard: state.screens.dashboard.community
})

const mapDispatchToProps = {
  fetchDashboardStatistics,
  loadModal
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)
