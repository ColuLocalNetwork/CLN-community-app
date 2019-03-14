import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {fetchToken, fetchTokenStatistics} from 'actions/token'
import {isUserExists} from 'actions/user'
import FontAwesome from 'react-fontawesome'
import {getClnBalance, getAccountAddress} from 'selectors/accounts'
import {formatWei} from 'utils/format'
import { USER_DATA_MODAL, WRONG_NETWORK_MODAL } from 'constants/uiConstants'
import {loadModal, hideModal} from 'actions/ui'
import TokenProgress from './TokenProgress'
import TopNav from './../TopNav'
import Breadcrumbs from './../elements/Breadcrumbs'
import ActivityContent from './ActivityContent'
import Bridge from './Bridge'
import {getBlockExplorerUrl} from 'utils/network'

const LOAD_USER_DATA_MODAL_TIMEOUT = 2000

class UserDataModal extends React.Component {
  componentDidMount (prevProps) {
    if (this.props.token.owner === this.props.accountAddress && !this.props.userExists) {
      this.timerId = setTimeout(this.props.loadUserDataModal, LOAD_USER_DATA_MODAL_TIMEOUT)
    }
  }

  componentWillUnmount () {
    clearTimeout(this.timerId)
  }

  render = () => null
}

UserDataModal.propTypes = {
  token: PropTypes.object.isRequired,
  accountAddress: PropTypes.string.isRequired,
  loadUserDataModal: PropTypes.func.isRequired,
  userExists: PropTypes.bool
}

class Dashboard extends Component {
  state = {
    copyStatus: null
  }

  handleIntervalChange = (userType, intervalValue) => {
    this.props.fetchTokenStatistics(this.props.tokenAddress, userType, intervalValue)
  }

  componentDidMount () {
    if (!this.props.token) {
      this.props.fetchToken(this.props.tokenAddress, {networkType: this.props.tokenNetworkType})
    }
    if (this.props.accountAddress) {
      this.props.isUserExists(this.props.accountAddress, {networkType: this.props.tokenNetworkType})
    }
    if (this.props.networkType !== 'fuse' && this.props.tokenNetworkType !== this.props.networkType) {
      this.props.loadModal(WRONG_NETWORK_MODAL)
    }
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentDidUpdate (prevProps) {
    if (this.props.dashboard.informationAdded && !prevProps.dashboard.informationAdded) {
      this.props.hideModal()
    }

    if (this.props.accountAddress && !prevProps.accountAddress) {
      this.props.isUserExists(this.props.accountAddress, {networkType: this.props.tokenNetworkType})
    }
  }

  componentWillUnmount () {
    window.removeEventListener('mousedown', this.handleClickOutside)
  }

  handleClickOutside = (event) => {
    if (this.content && !this.content.contains(event.target)) {
      this.setState({dropdownOpen: ''})
    }
  }

  showHomePage = (address) => {
    this.props.history.push('/')
  }

  copyToClipboard = (e) => {
    this.textArea.select()
    document.execCommand('copy')
    e.target.focus()
    this.setState({copyStatus: 'Copied!'})
    setTimeout(() => {
      this.setState({copyStatus: ''})
    }, 2000)
    this.textArea.value = ''
    this.textArea.value = this.props.tokenAddress
  }

  loadUserDataModal = () => this.props.loadModal(USER_DATA_MODAL, {
    tokenAddress: this.props.tokenAddress
  })

  openBlockExplorer = () => {
    const explorerUrl = `${getBlockExplorerUrl(this.props.tokenNetworkType)}/address/${this.props.tokenAddress}`
    window.open(explorerUrl, '_blank')
  }

  render () {
    if (!this.props.token) {
      return null
    }

    const { token } = this.props
    const { admin, user, steps } = this.props.dashboard
    return [
      <TopNav
        key={0}
        active
        history={this.props.history}
        showHomePage={this.showHomePage}
      />,
      <div key={1} className='dashboard-content'>
        <Breadcrumbs breadCrumbsText={token.name} setToHomepage={this.showHomePage} />
        <div className={`dashboard-container ${this.props.networkType}`}>
          <div className='dashboard-section'>
            <TokenProgress token={token} metadata={this.props.metadata} steps={steps} match={this.props.match} />
            <div className='dashboard-information'>
              <div className='dashboard-information-header'>
                <p className='dashboard-information-text'>Total supply</p>
                <p className='dashboard-information-big-count'>
                  {formatWei(token.totalSupply, 0)}
                  <span>{token.symbol}</span>
                </p>
              </div>
              <div className='dashboard-info' ref={content => (this.content = content)}>
                <ActivityContent stats={user} userType='user' title='users' handleChange={this.handleIntervalChange} />
                <ActivityContent stats={admin} userType='admin' handleChange={this.handleIntervalChange} />
              </div>
              <div className='dashboard-information-footer'>
                <div className='dashboard-information-small-text'>
                  <span className='text-asset'>Asset ID</span>
                  <form>
                    <textarea
                      onClick={this.openBlockExplorer}
                      ref={textarea => (this.textArea = textarea)}
                      value={this.props.tokenAddress}
                      readOnly
                    />
                  </form>
                </div>
                {document.queryCommandSupported('copy') &&
                  <p className='dashboard-information-period' onClick={this.copyToClipboard}>
                    <FontAwesome name='clone' />
                  </p>
                }
              </div>
              {this.state.copyStatus && <div className='dashboard-notification'>
                {this.state.copyStatus}
              </div>
              }
            </div>
          </div>
          <div>
            <Bridge accountAddress={this.props.accountAddress} token={this.props.token} foreignTokenAddress={this.props.tokenAddress} />
          </div>
        </div>
        {
          this.props.token && this.props.accountAddress && this.props.dashboard.hasOwnProperty('userExists') &&
            <UserDataModal
              token={this.props.token}
              accountAddress={this.props.accountAddress}
              userExists={this.props.dashboard.userExists}
              loadUserDataModal={this.loadUserDataModal}
            />
        }
      </div>
    ]
  }
}

const mapStateToProps = (state, {match}) => ({
  networkType: state.network.networkType,
  token: state.entities.tokens[match.params.address],
  tokenAddress: match.params.address,
  tokenNetworkType: match.params.networkType,
  metadata: state.entities.metadata,
  dashboard: state.screens.dashboard,
  accountAddress: getAccountAddress(state),
  clnBalance: getClnBalance(state)
})

const mapDispatchToProps = {
  fetchTokenStatistics,
  fetchToken,
  isUserExists,
  loadModal,
  hideModal
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)
