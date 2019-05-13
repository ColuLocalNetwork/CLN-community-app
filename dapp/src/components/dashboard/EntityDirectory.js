import React, { Component, Fragment, useEffect } from 'react'
import FontAwesome from 'react-fontawesome'
import { connect } from 'react-redux'
import classNames from 'classnames'
import Loader from 'components/Loader'
import { getClnBalance, getAccountAddress } from 'selectors/accounts'
import { REQUEST, PENDING, SUCCESS } from 'actions/constants'
import { getUsersEntities, getBusinessesEntities } from 'selectors/directory'
import { addEntity, fetchCommunity, fetchUsersEntities, fetchBusinessesEntities } from 'actions/directory'
import Entity from './Entity'
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
    value: 'admins'
  }
]

const EntityDirectoryDataFetcher = (props) => {
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

class EntityDirectory extends Component {
  constructor (props) {
    super(props)

    this.state = {
      showSearch: false,
      search: '',
      showUsers: false,
      filters: {
        pending: false,
        confirmed: true,
        admins: false
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
    submitEntity: (data) => this.props.addEntity(this.props.communityAddress, { ...data, type: 'business' })
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
      admins: false
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

  renderMerchants (entities) {
    if (entities.length) {
      return (
        entities.map((entity, index) => {
          return (
            <Entity
              key={index}
              index={index}
              entity={entity}
              address={this.props.homeTokenAddress}
              showProfile={() => this.showProfile(this.props.communityAddress, this.props.merchants[index].account)}
            />
          )
        }))
    } else {
      return <p className='entities__items__empty'>There are no any entities</p>
    }
  }

  renderItems = () => {
    const { showUsers } = this.state
    const { transactionStatus, merchants, users } = this.props
    const items = showUsers ? users : merchants

    const filteredItems = this.filterBySearch(this.state.search, items)

    console.log({ merchants, users })
    if (items && items.length) {
      return this.renderMerchants(filteredItems)
    } else {
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

  renderContent = () => {
    const { communityAddress } = this.props

    if (!communityAddress) {
      return (
        <Fragment>
          <div className='entities__not-deploy'>
            <p className='entities__not-deploy__title'>Businesses List</p>
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
    } else {
      return this.renderItems()
    }
  }

  canDeployBusinessList = () => !this.props.signatureNeeded &&
    isOwner(this.props.token, this.props.accountAddress) &&
    this.props.homeTokenAddress

  render () {
    const { network: { networkType } } = this.props
    const { showUsers, filters } = this.state

    return (
      <Fragment>
        <div className='entities__wrapper'>
          <div className='entities__container'>
            <div className='entities__actions'>
              <div className='entities__actions__filter'>
                <p className='entities__actions__filter__icon'><img src={filterIcon} /></p>
                <span>Filter&nbsp;|&nbsp;</span><span>Community users</span>
                <div className='filter-options'>
                  <ul className='options'>
                    {
                      filterOptions.map(({ label, value }) => {
                        return (
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
                      })
                    }
                  </ul>
                </div>
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
                  networkType === 'fuse'
                    ? (
                      <span onClick={!showUsers ? this.handleAddBusiness : null}>
                        <a style={{ backgroundImage: `url(${plusIcon})` }} />
                      </span>
                    ) : (
                      <span onClick={!showUsers ? this.handleAddBusiness : null}>
                        <FontAwesome name='plus-circle' />
                      </span>
                    )
                }
                {showUsers ? 'Add new user' : 'Add new merchant'}
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
              {this.renderContent()}
              {this.renderTransactionStatus()}
            </div>
          </div>

          <EntityDirectoryDataFetcher
            fetchHomeToken={this.props.fetchHomeToken}
            communityAddress={this.props.communityAddress}
            homeTokenAddress={this.props.homeTokenAddress}
            foreignTokenAddress={this.props.foreignTokenAddress}
            transactionStatus={this.props.transactionStatus}
            fetchCommunity={this.props.fetchCommunity}
            fetchBusinessesEntities={this.props.fetchBusinessesEntities}
            fetchUsersEntities={this.props.fetchUsersEntities}
          />
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = (state, { match, foreignTokenAddress }) => ({
  // entities: getEntities(state),
  network: state.network,
  users: getUsersEntities(state),
  merchants: getBusinessesEntities(state),
  clnBalance: getClnBalance(state),
  accountAddress: getAccountAddress(state),
  homeTokenAddress: state.entities.bridges[foreignTokenAddress] && state.entities.bridges[foreignTokenAddress].homeTokenAddress,
  ...state.screens.directory,
  ...getTransaction(state, state.screens.directory.transactionHash)
})

const mapDispatchToProps = {
  addEntity,
  loadModal,
  hideModal,
  fetchHomeToken,
  fetchCommunity,
  fetchBusinessesEntities,
  fetchUsersEntities
}

export default connect(mapStateToProps, mapDispatchToProps)(EntityDirectory)
