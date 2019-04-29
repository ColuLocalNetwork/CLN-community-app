import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'
import upperCase from 'lodash/upperCase'
import isEmpty from 'lodash/isEmpty'
import web3 from 'web3'
import { fetchToken, fetchTokenStatistics, transferToken, mintToken, burnToken } from 'actions/token'
import { isUserExists } from 'actions/user'
import { getClnBalance, getAccountAddress, getBalances } from 'selectors/accounts'
import { formatWei } from 'utils/format'
import { USER_DATA_MODAL, WRONG_NETWORK_MODAL, BUSINESS_LIST_MODAL, BRIDGE_MODAL, NO_DATA_ABOUT_OWNER_MODAL } from 'constants/uiConstants'
import { loadModal, hideModal } from 'actions/ui'
import { deployBridge } from 'actions/bridge'
import { createList } from 'actions/directory'
import TokenProgress from './TokenProgress'
import TopNav from 'components/TopNav'
import Breadcrumbs from 'components/elements/Breadcrumbs'
import ActivityContent from './ActivityContent'
import Bridge from './Bridge'
import EntityDirectory from './EntityDirectory'
import { isOwner } from 'utils/token'
import Tabs from 'components/common/Tabs'
import Message from 'components/common/Message'
import { getTransaction } from 'selectors/transaction'
import TransactionButton from 'components/common/TransactionButton'
import {FAILURE, SUCCESS, CONFIRMATION} from 'actions/constants'

const LOAD_USER_DATA_MODAL_TIMEOUT = 2000
const ERROR_MESSAGE = 'Oops, something went wrong'

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
  constructor (props) {
    super(props)

    this.state = {
      actionType: null,
      transfer: {
        toField: null,
        amount: null
      },
      mintBurnAmount: '',
      transferMessage: false,
      burnMessage: false,
      mintMessage: false,
      lastAction: {}
    }
  }

  handleIntervalChange = (userType, intervalValue) => {
    this.props.fetchTokenStatistics(this.props.tokenAddress, userType, intervalValue)
  }

  componentDidMount () {
    if (!this.props.token) {
      this.props.fetchToken(this.props.tokenAddress)
    }
    if (this.props.accountAddress) {
      this.props.isUserExists(this.props.accountAddress)
    }
    if (this.props.networkType !== 'fuse' && this.props.tokenNetworkType !== this.props.networkType) {
      this.props.loadModal(WRONG_NETWORK_MODAL, { supportedNetworks: [this.props.tokenNetworkType], handleClose: this.showHomePage })
    }
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentDidUpdate (prevProps) {
    if (this.props.dashboard.informationAdded && !prevProps.dashboard.informationAdded) {
      this.props.hideModal()
    }

    if (this.props.accountAddress && !prevProps.accountAddress) {
      this.props.isUserExists(this.props.accountAddress)
    }

    if (this.props.transactionStatus === 'SUCCESS' && (!prevProps.transactionStatus || prevProps.transactionStatus === 'PENDING')) {
      this.setState({
        ...this.state,
        transfer: {
          toField: null,
          amount: null
        },
        mintBurnAmount: '',
        actionType: null
      })
    }

    if (this.props.transactionStatus === FAILURE && (!prevProps.transactionStatus || prevProps.transactionStatus === 'PENDING')) {
      if (this.props.transferError) {
        this.setState({ ...this.state, transferMessage: true })
      } else if (this.props.burnError) {
        this.setState({ ...this.state, burnMessage: true })
      } else if (this.props.mintError) {
        this.setState({ ...this.state, mintMessage: true })
      }
    }
  }
  componentWillUnmount () {
    window.removeEventListener('mousedown', this.handleClickOutside)
  }

  handleClickOutside = (event) => {
    if (this.content && !this.content.contains(event.target)) {
      this.setState({ dropdownOpen: '' })
    }
  }

  showHomePage = () => {
    this.props.history.push('/')
  }

  loadUserDataModal = () => {
    if (isOwner(this.props.token, this.props.accountAddress)) {
      this.props.loadModal(USER_DATA_MODAL, { tokenAddress: this.props.tokenAddress })
    } else {
      this.props.loadModal(NO_DATA_ABOUT_OWNER_MODAL, { tokenAddress: this.props.tokenAddress })
    }
  }

  loadBridgePopup = () => this.props.loadModal(BRIDGE_MODAL, {
    tokenAddress: this.props.tokenAddress,
    isOwner: isOwner(this.props.token, this.props.accountAddress),
    buttonAction: this.props.deployBridge
  })

  onlyOnFuse = (successFunc) => {
    if (this.props.networkType === 'fuse') {
      successFunc()
    } else {
      this.props.loadModal(WRONG_NETWORK_MODAL, { supportedNetworks: ['fuse'] })
    }
  }

  handleMintOrBurn = actionType =>
    this.setState({ actionType })

  onChange = (mintBurnAmount) => {
    const { actionType } = this.state
    if (!actionType) {
      return
    }
    this.setState({ mintBurnAmount })
  }

  loadBusinessListPopup = () => {
    this.onlyOnFuse(() => {
      this.props.loadModal(BUSINESS_LIST_MODAL, {
        tokenAddress: this.props.tokenAddress,
        isOwner: isOwner(this.props.token, this.props.accountAddress),
        buttonAction: this.props.createList
      })
    })
  }

  handleToField = toField => {
    const { transfer: { ...data } } = this.state
    this.setState({ transfer: { ...data, toField } })
  }

  handleAmountField = amount => {
    const { transfer: { ...data } } = this.state
    this.setState({ transfer: { ...data, amount } })
  }

  handleMintOrBurnClick = () => {
    const { burnToken, mintToken, tokenAddress } = this.props
    const { actionType, mintBurnAmount } = this.state

    if (actionType === 'mint') {
      mintToken(tokenAddress, web3.utils.toWei(String(mintBurnAmount)))
    } else {
      burnToken(tokenAddress, web3.utils.toWei(String(mintBurnAmount)))
    }

    this.setState({ ...this.state, lastAction: { actionType, mintBurnAmount } })
  }

  handleTransper = () => {
    const { transferToken, tokenAddress } = this.props
    const { transfer: { toField, amount } } = this.state
    transferToken(tokenAddress, toField, web3.utils.toWei(String(amount)))
  }

  closeMessage = () => {
    this.setState({ showMessage: false })
  }

  isShow = () => {
    const { mintMessage, burnMessage, actionType } = this.state
    const { transactionStatus } = this.props
    const sharedCondition = transactionStatus && (transactionStatus === SUCCESS || transactionStatus === CONFIRMATION)
    if (actionType === 'mint') {
      return sharedCondition && mintMessage
    } else {
      return sharedCondition && burnMessage
    }
  }

  isError = () => {
    const { mintMessage, burnMessage, actionType } = this.state
    const { transactionStatus } = this.props
    if (actionType === 'mint') {
      return transactionStatus && transactionStatus === FAILURE && mintMessage
    } else {
      return transactionStatus && transactionStatus === FAILURE && burnMessage
    }
  }

  render () {
    if (!this.props.token) {
      return null
    }
    const {
      actionType,
      mintBurnAmount,
      lastAction,
      transfer,
      transferMessage
    } = this.state

    const {
      token,
      accountAddress,
      transactionStatus,
      balances,
      tokenAddress,
      dashboard,
      isTransfer,
      isMinting,
      isBurning,
      networkType,
      tokenNetworkType,
      burnSignature,
      mintSignature,
      transferSignature,
      metadata,
      history,
      match
    } = this.props

    const { tokenType } = token
    const balance = balances[tokenAddress]
    const { admin, user, steps } = dashboard
    return [
      <TopNav
        key={0}
        active
        history={history}
      />,
      <div key={1} className='dashboard-content'>
        <Breadcrumbs breadCrumbsText={token.name} setToHomepage={this.showHomePage} />
        <div className={`dashboard-container ${networkType}`}>
          <div className='dashboard-section'>
            <TokenProgress
              token={token}
              networkType={tokenNetworkType}
              metadata={metadata}
              steps={steps}
              tokenAddress={tokenAddress}
              tokenNetworkType={tokenNetworkType}
              match={match}
              loadBridgePopup={this.loadBridgePopup}
              loadUserDataModal={this.loadUserDataModal}
              loadBusinessListPopup={this.loadBusinessListPopup}
            />
            <Tabs>
              <div label='Stats'>
                <div className='transfer-tab__balance'>
                  <span className='title'>Balance: </span>
                  <span className='amount'>{balance ? formatWei(balance, 0) : 0}</span>
                  <span className='symbol'>{token.symbol}</span>
                </div>
                <hr className='transfer-tab__line' />
                <div className='transfer-tab__content' ref={content => (this.content = content)}>
                  <ActivityContent stats={user} userType='user' title='users' handleChange={this.handleIntervalChange} />
                  <ActivityContent stats={admin} userType='admin' handleChange={this.handleIntervalChange} />
                </div>
              </div>
              <div label='Transfer' className={classNames({ 'tab__item--loader': isTransfer || transferSignature })}>
                <div className='transfer-tab'>
                  <div className='transfer-tab__balance'>
                    <span className='title'>Balance: </span>
                    <span className='amount'>{balance ? formatWei(balance, 0) : 0}</span>
                    <span className='symbol'>{token.symbol}</span>
                  </div>
                  <hr className='transfer-tab__line' />
                  <div className='transfer-tab__content'>

                    <Message
                      message={'Your money has been sent successfully'}
                      isOpen={transactionStatus && (transactionStatus === 'SUCCESS' || transactionStatus === 'CONFIRMATION') && transferMessage}
                      clickHandler={() => this.setState({ transferMessage: false })}
                      subTitle=''
                    />
                    <Message
                      message={ERROR_MESSAGE}
                      isOpen={transactionStatus && transactionStatus === FAILURE && transferMessage}
                      clickHandler={() => this.setState({ transferMessage: false })}
                    />

                    <div className='transfer-tab__content__to-field'>
                      <span className='transfer-tab__content__to-field__text'>To</span>
                      <input className='transfer-tab__content__to-field__input' onChange={(e) => this.handleToField(e.target.value)} />
                    </div>
                    <div className='transfer-tab__content__amount'>
                      <span className='transfer-tab__content__amount__text'>Amount</span>
                      <input className='transfer-tab__content__amount__field' type='number' placeholder='...' onChange={(e) => this.handleAmountField(e.target.value)} />
                    </div>

                    <div className='transfer-tab__content__button'>
                      <TransactionButton clickHandler={this.handleTransper} disabled={isEmpty(transfer.amount)} />
                    </div>
                  </div>
                </div>
                <Message message={'Pending'} isOpen={isTransfer} isDark subTitle={`Your money on it's way`} />
                <Message message={'Pending'} isOpen={transferSignature} isDark />
              </div>

              {
                token &&
                tokenType &&
                tokenType === 'mintableBurnable' &&
                networkType !== 'fuse' &&
                <div label='Mint \ Burn' className={classNames({ 'tab__item--loader': (mintSignature || burnSignature) || (isBurning || isMinting) })}>
                  <div className='transfer-tab'>
                    <div className='transfer-tab__balance'>
                      <span className='title'>Balance: </span>
                      <span className='amount'>{balance ? formatWei(balance, 0) : 0}</span>
                      <span className='symbol'>{token.symbol}</span>
                    </div>
                    <hr className='transfer-tab__line' />
                    <div className='transfer-tab__content'>
                      <Message
                        message={`Your just ${lastAction.actionType}ed ${lastAction.mintBurnAmount} ${token.symbol} on ${tokenNetworkType} network`}
                        isOpen={this.isShow()}
                        subTitle=''clickHandler={this.closeMessage}
                      />
                      <Message
                        message={ERROR_MESSAGE}
                        isOpen={this.isError()}
                        clickHandler={
                          actionType === 'mint'
                            ? () => this.setState({ mintMessage: false })
                            : () => this.setState({ burnMessage: false })
                        }
                      />
                      <div className='transfer-tab__actions'>
                        <button disabled={!isOwner(token, accountAddress)} className={classNames('transfer-tab__actions__btn', { 'transfer-tab__actions__btn--active': actionType === 'mint' })} onClick={() => this.handleMintOrBurn('mint')}>Mint</button>
                        <button disabled={!isOwner(token, accountAddress)} className={classNames('transfer-tab__actions__btn', { 'transfer-tab__actions__btn--active': actionType === 'burn' })} onClick={() => this.handleMintOrBurn('burn')}>Burn</button>
                      </div>
                      <div className='transfer-tab__content__amount'>
                        <span className='transfer-tab__content__amount__text'>Amount</span>
                        <input className='transfer-tab__content__amount__field' type='number' disabled={isEmpty(actionType)} placeholder='...' value={mintBurnAmount} onChange={(e) => this.onChange(e.target.value)} />
                      </div>
                      <div className='transfer-tab__content__button'>
                        {
                          actionType && <TransactionButton disabled={isEmpty(mintBurnAmount)} clickHandler={this.handleMintOrBurnClick} frontText={upperCase(actionType)} />
                        }
                      </div>
                    </div>
                  </div>
                  <Message message={'Pending'} isOpen={isBurning || isMinting} isDark subTitle='' />
                  <Message message={'Pending'} isOpen={mintSignature || burnSignature} isDark />
                </div>
              }
            </Tabs>
          </div>
          <Bridge
            accountAddress={accountAddress}
            token={this.props.token}
            foreignTokenAddress={this.props.tokenAddress}
            loadBridgePopup={this.loadBridgePopup}
            handleTransfer={this.handleTransfer}
            network={networkType}
          />
          <div className='dashboard-entities'>
            <EntityDirectory
              history={this.props.history}
              foreignTokenAddress={this.props.tokenAddress}
              token={this.props.token}
              loadBusinessListPopup={this.loadBusinessListPopup}
              onlyOnFuse={this.onlyOnFuse}
            />
          </div>
        </div>
        {
          this.props.token && accountAddress && this.props.dashboard.hasOwnProperty('userExists') &&
          <UserDataModal
            token={this.props.token}
            accountAddress={accountAddress}
            userExists={this.props.dashboard.userExists}
            loadUserDataModal={this.loadUserDataModal}
          />
        }
      </div>
    ]
  }
}

const mapStateToProps = (state, { match }) => ({
  ...state.screens.token,
  networkType: state.network.networkType,
  token: state.entities.tokens[match.params.address],
  tokenAddress: match.params.address,
  tokenNetworkType: match.params.networkType,
  metadata: state.entities.metadata,
  dashboard: state.screens.dashboard,
  accountAddress: getAccountAddress(state),
  clnBalance: getClnBalance(state),
  balances: getBalances(state),
  ...getTransaction(state, state.screens.token.transactionHash),
  homeTokenAddress: state.entities.bridges[match.params.address] && state.entities.bridges[match.params.address].homeTokenAddress
})

const mapDispatchToProps = {
  fetchTokenStatistics,
  fetchToken,
  isUserExists,
  loadModal,
  hideModal,
  deployBridge,
  createList,
  transferToken,
  mintToken,
  burnToken
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)
