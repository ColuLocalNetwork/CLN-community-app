import React, { Component } from 'react'
import ClnIcon from 'images/cln.png'
import { connect } from 'react-redux'
import {fetchToken, fetchTokenStatistics} from 'actions/token'
import classNames from 'classnames'
import FontAwesome from 'react-fontawesome'
import {getClnBalance, getAccountAddress} from 'selectors/accounts'
import CommunityLogo from 'components/elements/CommunityLogo'
import {formatWei} from 'utils/format'
import Moment from 'moment'
import find from 'lodash/find'
import { USER_DATA_MODAL } from 'constants/uiConstants'
import {loadModal, hideModal} from 'actions/ui'
import Header from './Header'

const intervals = {
  MONTH: 'month',
  WEEK: 'week',
  DAY: 'day'
}

const dropdownOptions = [
  {
    text: 'Monthly',
    value: intervals.MONTH
  },
  {
    text: 'Weekly',
    value: intervals.WEEK
  },
  {
    text: 'Daily',
    value: intervals.DAY
  }
]

const getCurrentInterval = (intervalType) => {
  const date = new Date()
  switch (intervalType) {
    case intervals.DAY:
      return Moment(date).date()
    case intervals.WEEK:
      return Moment(date).week()
    case intervals.MONTH:
      // mongodb numbers month from 1 to 12 while moment from 0 to 11
      return Moment(date).month() + 1
  }
}

const getLatestDataEntry = (intervalType, stats) => {
  if (!stats || !stats[0]) {
    return null
  }
  const interval = getCurrentInterval(intervalType)
  return find(stats, {interval})
}

class ActivityDropdown extends Component {
  state = {
    isOpen: false
  }

  handleDropdownClick = (item) => {
    this.setState({
      isOpen: false
    })
    this.props.handleChange(item)
  }

  handleOpenDropDown = () => this.setState({isOpen: true})

  componentDidMount () {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount () {
    window.removeEventListener('mousedown', this.handleClickOutside)
  }

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({isOpen: false})
    }
  }

  setWrapperRef = (node) => {
    this.wrapperRef = node
  }

  render () {
    return (
      <div ref={this.setWrapperRef} className='dashboard-information-period'>
        <span className='dashboard-information-period-text' onClick={this.handleOpenDropDown}>
          {this.props.interval.text} <FontAwesome name='caret-down' />
        </span>
        {this.state.isOpen &&
          <div className='dashboard-information-period-additional'>
            {dropdownOptions.map((item, index) =>
              <div
                className={classNames(
                  'dashboard-information-period-point',
                  this.props.interval.value === item.value ? 'active-point' : null
                )}
                key={index}
                onClick={() => this.handleDropdownClick(item)}
              >
                {item.text}
              </div>
            )}
          </div>
        }
      </div>
    )
  }
}

class ActivityContent extends Component {
  state = {
    interval: dropdownOptions[0]
  }

  componentDidMount () {
    this.props.handleChange(this.props.userType, this.state.interval.value)
  }

  handleIntervalChange = (interval) => {
    this.setState({interval})
    this.props.handleChange(this.props.userType, interval.value)
  }

  render () {
    const latestDataEntry = getLatestDataEntry(this.state.interval.value, this.props.stats)
    return (
      <div className='dashboard-information-content' >
        <div className='dashboard-information-content-activity' key='0'>
          <p className='dashboard-information-small-text'>
            <span>{this.props.title || this.props.userType}</span> Activity
          </p>
          <ActivityDropdown interval={this.state.interval} handleChange={this.handleIntervalChange} />
        </div>,
        <div className='dashboard-information-content-number' key='1'>
          <p className='dashboard-information-small-text'>
            Number of transactions
          </p>
          <p className='dashboard-information-number'>
            {latestDataEntry ? latestDataEntry.totalCount : '0'}
          </p>
        </div>,
        <div className='dashboard-information-content-number' key='2'>
          <p className='dashboard-information-small-text'>
            Transactions volume
          </p>
          <p className='dashboard-information-number'>
            {latestDataEntry ? formatWei(latestDataEntry.volume, 0) : '0'}
          </p>
        </div>
      </div>)
  }
}

class Dashboard extends Component {
  state = {
    copyStatus: null
  }

  handleIntervalChange = (userType, intervalValue) => {
    this.props.fetchTokenStatistics(this.props.match.params.address, userType, intervalValue)
  }

  componentDidMount () {
    if (!this.props.token) {
      this.props.fetchToken(this.props.match.params.address)
    }
    if (this.props.location.search === '?verify') {
      this.showUserDataPopup()
    }
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentDidUpdate (prevProps) {
    if (this.props.dashboard.informationAdded && !prevProps.dashboard.informationAdded) {
      this.props.hideModal()
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
    this.textArea.value = this.props.match.params.address
  }

  showUserDataPopup = () => this.props.loadModal(USER_DATA_MODAL, {
    tokenAddress: this.props.match.params.address
  })

  render () {
    if (!this.props.token) {
      return null
    }

    const {token} = this.props
    const { admin, user } = this.props.dashboard

    return [
      <Header
        accountAddress={this.props.accountAddress}
        clnBalance={this.props.clnBalance}
        match={this.props.match}
        history={this.props.history}
        showHomePage={this.showHomePage}
        key={0}
      />,
      <div key={1} className='dashboard-content'>
        <div className='dashboard-header'>
          <button
            className='quit-button ctrl-btn'
            onClick={this.showHomePage}
          >
            <FontAwesome className='ctrl-icon' name='times' />
          </button>
        </div>
        <div className='dashboard-container'>
          <div className='dashboard-sidebar'>
            <CommunityLogo token={token} metadata={this.props.metadata[token.tokenURI] || {}} />
            <h3 className='dashboard-title'>{token.name}</h3>
          </div>
          <div className='dashboard-information'>
            <div className='dashboard-information-header'>
              <div className='dashboard-information-header-content'>
                <p className='dashboard-information-top'>
                  <span className='dashboard-information-logo'><img src={ClnIcon} /></span>
                  <span className='dashboard-information-text'>Total supply</span>
                </p>
                <p className='dashboard-information-big-count'>
                  {formatWei(token.totalSupply, 0)}
                  <span>{token.symbol}</span>
                </p>
              </div>
            </div>
            <div className='dashboard-info' ref={content => (this.content = content)}>
              <ActivityContent stats={user} userType='user' title='users' handleChange={this.handleIntervalChange} />
              <ActivityContent stats={admin} userType='admin' handleChange={this.handleIntervalChange} />
            </div>
            <div className='dashboard-information-footer'>
              <div className='dashboard-information-small-text'>
                <span>Asset ID</span>
                <form>
                  <textarea
                    ref={textarea => (this.textArea = textarea)}
                    value={this.props.match.params.address}
                    readOnly
                  />
                </form>
              </div>
              {document.queryCommandSupported('copy') &&
                <p className='dashboard-information-period' onClick={this.copyToClipboard}>
                  copy
                </p>
              }
            </div>
            {this.state.copyStatus && <div className='dashboard-notification'>
              {this.state.copyStatus}
            </div>
            }
          </div>
        </div>
      </div>
    ]
  }
}

const mapStateToProps = (state, {match}) => ({
  token: state.entities.tokens[match.params.address],
  metadata: state.entities.metadata,
  dashboard: state.screens.dashboard,
  accountAddress: getAccountAddress(state),
  clnBalance: getClnBalance(state)
})

const mapDispatchToProps = {
  fetchTokenStatistics,
  fetchToken,
  loadModal,
  hideModal
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)
