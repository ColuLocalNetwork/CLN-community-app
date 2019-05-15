import React, { Component, Fragment, useEffect } from 'react'
import FontAwesome from 'react-fontawesome'
import { connect } from 'react-redux'
import classNames from 'classnames'
import Loader from 'components/Loader'
import { getClnBalance, getAccountAddress } from 'selectors/accounts'
import { REQUEST, PENDING } from 'actions/constants'
import { getUsersEntities, getBusinessesEntities, checkIsAdmin } from 'selectors/directory'
import {
  addEntity,
  fetchCommunity,
  fetchUsersEntities,
  fetchBusinessesEntities,
  removeEntity,
  makeAdmin,
  removeAsAdmin,
  confirmUser
} from 'actions/directory'
import Entity from './Entity.jsx'
import EmptyBusinessList from 'images/emptyBusinessList.png'
import { loadModal, hideModal } from 'actions/ui'
import { ADD_DIRECTORY_ENTITY } from 'constants/uiConstants'
import ReactGA from 'services/ga'
import { isOwner } from 'utils/token'
import { fetchHomeToken } from 'actions/bridge'
import plusIcon from 'images/add.svg'
import { getTransaction } from 'selectors/transaction'
import filterIcon from 'images/filter.svg'

const filterOptions = [
  {
    label: 'Community users',
    value: 'confirmed'
  },
  {
    label: 'Pending users',
    value: 'pending'
  },
  {
    label: 'Community admins',
    value: 'isAdmin'
  }
]

const EntitiesManagerDataFetcher = (props) => {
  useEffect(() => {
    if (props.foreignTokenAddress) {
      props.fetchHomeToken(props.foreignTokenAddress)
      props.fetchCommunity(props.foreignTokenAddress)
    }
  }, [props.foreignTokenAddress])

  useEffect(() => {
    if (props.communityAddress) {
      props.fetchUsersEntities(props.communityAddress)
      props.fetchBusinessesEntities(props.communityAddress)
    }
  }, [props.communityAddress])

  return null
}

class EntitiesManager extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showSearch: false,
      search: '',
      showUsers: true,
      filters: {
        pending: false,
        confirmed: true,
        isAdmin: false
      }
    }
  }

  showHomePage = (address) => {
    this.props.history.push('/')
  }

  showProfile = (address, hash) => {
    this.props.history.push(`/view/directory/${address}/${hash}`)
    ReactGA.event({
      category: 'Directory',
      action: 'Click',
      label: 'directory'
    })
  }

  handleAddBusiness = () => {
    this.props.onlyOnFuse(this.loadAddingModal)
  }

  loadAddingModal = () => this.props.loadModal(ADD_DIRECTORY_ENTITY, {
    submitEntity: (data) => this.props.addEntity(this.props.communityAddress, { ...data, type: this.state.showUsers ? 'user' : 'business' })
  })

  renderTransactionStatus = () => {
    if (this.props.signatureNeeded || this.props.transactionStatus === PENDING) {
      return (
        <div className='entities__loader'>
          <Loader color='#3a3269' className='loader' />
        </div>
      )
    }
  }

  handleRadioInput = (e) => {
    const filters = {
      pending: false,
      confirmed: false,
      isAdmin: false
    }
    this.setState({ filters: { ...filters, [e.target.value]: true } })
  }

  setShowingSearch = () => this.setState({ showSearch: !this.state.showSearch })

  setSearchValue = (e) => this.setState({ search: e.target.value })

  filterBySearch = (search, entities) =>
    search ? entities.filter(entity =>
      entity.name.toLowerCase().search(
        this.state.search.toLowerCase()) !== -1
    ) : entities

  filterByRadio = (users) => {
    const { filters } = this.state
    const val = Object.keys(filters).find((key) => filters[key])
    return users.filter((user) => val === 'confirmed' ? user : user[val])
  }

  handleRemoveEntity = (account) => {
    const { removeEntity, communityAddress } = this.props
    removeEntity(communityAddress, account)
  }

  handleMakeAdmin = (account) => {
    const { makeAdmin } = this.props
    makeAdmin(account)
  }

  handleRemoveAdmin = (account) => {
    const { removeAsAdmin } = this.props
    removeAsAdmin(account)
  }

  handleConfirmUser = (account) => {
    const { confirmUser } = this.props
    confirmUser(account)
  }

  renderList = (entities) => {
    if (entities.length) {
      return (
        entities.map((entity, index) =>
          <Entity
            key={index}
            index={index}
            entity={entity}
            address={this.props.homeTokenAddress}
            makeAdmin={this.handleMakeAdmin}
            removeAdmin={this.handleRemoveAdmin}
            handleRemove={this.handleRemoveEntity}
            confirmUser={this.handleConfirmUser}
            showProfile={() => this.showProfile(this.props.communityAddress, entity.account)}
          />
        ))
    } else {
      return <p className='entities__items__empty'>There are no any entities</p>
    }
  }

  renderItems = () => {
    const { showUsers } = this.state
    const { transactionStatus, merchants, users } = this.props
    const items = showUsers ? users : merchants

    let filteredItems = this.filterBySearch(this.state.search, items)

    if (showUsers) {
      filteredItems = this.filterByRadio(filteredItems)
    }

    if (items && items.length) {
      return this.renderList(filteredItems)
    } else {
      if (!transactionStatus) {
        if (showUsers) {
          return (
            <div className='entities__empty-list'>
              <div className='entities__empty-list__title'>Kinda sad in here, isn’t it?</div>
              <div className='entities__empty-list__text'>You can keep watching Netflix later, add a user and let’s start Rock’n’Roll!</div>
              <button
                className='entities__empty-list__btn'
                disabled={transactionStatus === REQUEST || transactionStatus === PENDING}
              >
                Add new user
              </button>
            </div>
          )
        } else {
          return (
            <div className='entities__empty-list'>
              <div className='entities__empty-list__title'>Kinda sad in here, isn’t it?</div>
              <div className='entities__empty-list__text'>You can keep watching Netflix later, add a business and let’s start Rock’n’Roll!</div>
              <button
                className='entities__empty-list__btn'
                onClick={this.handleAddBusiness}
                disabled={transactionStatus === REQUEST || transactionStatus === PENDING}
              >
                Add new merchant
              </button>
            </div>
          )
        }
      }
    }
  }

  renderNotDeployContent = () => {
    const { showUsers } = this.state

    if (showUsers) {
      return (
        <Fragment>
          <div className='entities__not-deploy'>
            <p className='entities__not-deploy__title'>Members List</p>
            <p className='entities__not-deploy__text'>This thing needs be activated some kind of text and explanation</p>
            <button
              className='entities__not-deploy__btn'
              onClick={this.props.loadBusinessListPopup}
              disabled={!this.canDeployBusinessList()}
            >
              Deploy members list
          </button>
          </div>
          <div className='entities__not-deploy__placeholder'>
            <img src={EmptyBusinessList} />
          </div>
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          <div className='entities__not-deploy'>
            <p className='entities__not-deploy__title'>Merchants List</p>
            <p className='entities__not-deploy__text'>This thing needs be activated some kind of text and explanation</p>
            <button
              className='entities__not-deploy__btn'
              onClick={this.props.loadBusinessListPopup}
              disabled={!this.canDeployBusinessList()}
            >
              Deploy business list
          </button>
          </div>
          <div className='entities__not-deploy__placeholder'>
            <img src={EmptyBusinessList} />
          </div>
        </Fragment>
      )
    }
  }

  canDeployBusinessList = () => !this.props.signatureNeeded &&
    isOwner(this.props.token, this.props.accountAddress) &&
    this.props.homeTokenAddress

  render() {
    const { network: { networkType }, isClosed, isAdmin, communityAddress } = this.props
    const { showUsers, filters } = this.state
    const val = Object.keys(filters).find((key) => filters[key])
    return (
      <Fragment>
        <div className='entities__wrapper'>
          <div className='entities__container'>
            {
              communityAddress ? (
                <Fragment>
                  <div className='entities__actions'>
                    <div className='entities__actions__filter'>
                      {
                        showUsers && isAdmin && (
                          <Fragment>
                            <p className='entities__actions__filter__icon'><img src={filterIcon} /></p>
                            <span>Filter&nbsp;|&nbsp;</span>
                            <span>{filterOptions.find(({ value }) => val === value).label}</span>
                            <div className='filter-options'>
                              <ul className='options'>
                                {
                                  filterOptions
                                    .filter(({ value }) => value !== 'pending' && !isClosed)
                                    .map(({ label, value }) =>
                                      <li key={value} className='options__item'>
                                        <label>{label}
                                          <input
                                            type='radio'
                                            name='filter'
                                            checked={filters[value]}
                                            value={value}
                                            onChange={this.handleRadioInput}
                                          />
                                          <span />
                                        </label>
                                      </li>
                                    )
                                }
                              </ul>
                            </div>
                          </Fragment>
                        )
                      }
                    </div>
                    <div className='entities__actions__buttons'>
                      <button
                        className={classNames('entities__actions__buttons__btn', { 'entities__actions__buttons__btn--active': !showUsers })}
                        onClick={() => this.setState({ showUsers: false })}
                      >Merchant</button>
                      <button
                        className={classNames('entities__actions__buttons__btn', { 'entities__actions__buttons__btn--active': showUsers })}
                        onClick={() => this.setState({ showUsers: true })}
                      >User</button>
                    </div>
                    <div className='entities__actions__add'>
                      {
                        (isAdmin || !isClosed) && (
                          <Fragment>
                            {
                              networkType === 'fuse'
                                ? (
                                  <span onClick={this.handleAddBusiness}>
                                    <a style={{ backgroundImage: `url(${plusIcon})` }} />
                                  </span>
                                ) : (
                                  <span onClick={this.handleAddBusiness}>
                                    <FontAwesome name='plus-circle' />
                                  </span>
                                )
                            }
                            {showUsers ? 'Add new user' : 'Add new merchant'}
                          </Fragment>
                        )
                      }
                    </div>
                  </div>
                  <div className='entities__search'>
                    <button className='entities__search__icon' onClick={() => this.setShowingSearch()}>
                      <FontAwesome name='search' />
                    </button>
                    <input
                      value={this.state.search}
                      onChange={this.setSearchValue}
                      placeholder={showUsers ? 'Search a user...' : 'Search a merchant...'}
                    />
                  </div>
                  <div className='entities__items'>
                    {this.renderTransactionStatus()}
                    {this.renderItems()}
                  </div>
                </Fragment>
              ) : (
                  <div className='entities__not-deploy__wrapper'>
                    {this.renderNotDeployContent()}
                  </div>
                )
            }

          </div>

          <EntitiesManagerDataFetcher
            fetchHomeToken={this.props.fetchHomeToken}
            communityAddress={this.props.communityAddress}
            homeTokenAddress={this.props.homeTokenAddress}
            foreignTokenAddress={this.props.foreignTokenAddress}
            fetchCommunity={this.props.fetchCommunity}
            fetchBusinessesEntities={this.props.fetchBusinessesEntities}
            fetchUsersEntities={this.props.fetchUsersEntities}
          />
        </div>
      </Fragment >
    )
  }
}

const mapStateToProps = (state, { match, foreignTokenAddress }) => ({
  network: state.network,
  users: getUsersEntities(state),
  merchants: getBusinessesEntities(state),
  clnBalance: getClnBalance(state),
  accountAddress: getAccountAddress(state),
  homeTokenAddress: state.entities.bridges[foreignTokenAddress] && state.entities.bridges[foreignTokenAddress].homeTokenAddress,
  ...state.screens.directory,
  ...getTransaction(state, state.screens.directory.transactionHash),
  isAdmin: checkIsAdmin(state)
})

const mapDispatchToProps = {
  addEntity,
  confirmUser,
  makeAdmin,
  removeAsAdmin,
  removeEntity,
  loadModal,
  hideModal,
  fetchHomeToken,
  fetchCommunity,
  fetchBusinessesEntities,
  fetchUsersEntities
}

export default connect(mapStateToProps, mapDispatchToProps)(EntitiesManager)
