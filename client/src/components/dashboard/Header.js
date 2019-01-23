import React, { Component } from 'react'
import { connect } from 'react-redux'
import ProfileIcon from 'images/user-dashboard.svg'
import EntityHeader from 'images/entity_logo.png'
import {BigNumber} from 'bignumber.js'
import classNames from 'classnames'
import ReactGA from 'services/ga'
import FontAwesome from 'react-fontawesome'

class Header extends Component {
  showDashboard = (address) => {
    this.props.history.push(`/view/dashboard/${address}`)
    ReactGA.event({
      category: 'Dashboard',
      action: 'Click',
      label: 'dashboard'
    })
  }
  showDirectory = (address) => {
    this.props.history.push(`/view/directory/${address}`)
    ReactGA.event({
      category: 'Directory',
      action: 'Click',
      label: 'directory'
    })
  }

  render () {
    const hash = this.props.history.location.pathname.split('/')
    const entity = Object.keys(this.props.entities).length ? this.props.entities[hash[hash.length - 1]] : null
    const link = this.props.match.path.split('/')
    const activeDashboardLinkClass = classNames({
      'entities-header-nav-link': true,
      'active-link': link[2] === 'dashboard' && (entity && entity.name === undefined)
    })
    const activeDirectoryLinkClass = classNames({
      'entities-header-nav-link': true,
      'active-link': link[2] === 'directory' && (entity && entity.name === undefined)
    })
    return (
      <div className='entities-header'>
        <div className='entities-header-content'>
          <div className='entities-logo' onClick={() => this.props.showHomePage()}>
            <img src={EntityHeader} />
            fuse
          </div>
          <div className='entities-header-nav'>
            <span
              onClick={() => this.showDashboard(this.props.match.params.address)}
              className={activeDashboardLinkClass}
            >
              Dashboard
            </span>
            <span
              onClick={() => this.showDirectory(this.props.match.params.address)}
              className={activeDirectoryLinkClass}
            >
              Business
            </span>
            {entity && entity.name && <span className='entities-header-nav-link-name'>
              {entity.name}
              <FontAwesome name='times-circle' onClick={() => this.showDirectory(this.props.match.params.address)} />
            </span>}
          </div>
        </div>
        <div className='entities-header-profile'>
          <span className='profile-icon'>
            <img src={ProfileIcon} />
          </span>
          <span className='profile-balance'>
            <span className='balance-address'>{this.props.network.accountAddress || 'Connect Metamask'}</span>
            {(this.props.clnBalance)
              ? <div className='top-nav-balance'>
                <span className='balance-text'>Balance:</span>
                <span className='balance-number'>{new BigNumber(this.props.clnBalance).div(1e18).toFormat(2, 1)}</span>
              </div>
              : null}
          </span>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  entities: state.entities.metadata
})

export default connect(mapStateToProps, null)(Header)
