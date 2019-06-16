import React, { PureComponent } from 'react'
import FontAwesome from 'react-fontawesome'
import CopyToClipboard from 'components/common/CopyToClipboard'
import { getBlockExplorerUrl } from 'utils/network'
import classNames from 'classnames'
import { formatAddress } from 'utils/format'
import { isMobile } from 'react-device-detect'

export default class Entity extends PureComponent {
  state = {
    isOpen: false
  }

  componentDidMount () {
    document.addEventListener('click', this.handleClickOutside)
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.handleClickOutside)
  }

  handleClickOutside = (event) => {
    if (this.dropdownRef && !this.dropdownRef.contains(event.target)) {
      this.setState({ isOpen: false })
    }
  }

  setDropdownRef = (node) => {
    this.dropdownRef = node
  }

  render () {
    const {
      entity: {
        name,
        businessType,
        type,
        account,
        isAdmin: hasAdminRole,
        isApproved
      },
      metadata,
      showProfile,
      handleRemove,
      addAdminRole,
      removeAdminRole,
      confirmUser,
      isAdmin
    } = this.props

    const { isOpen } = this.state

    return (
      <div className='entities__entity'>
        <div className='entities__entity__logo' onClick={type !== 'user' ? () => showProfile() : null}>
          <FontAwesome name='bullseye' />
        </div>
        <div className='entities__entity__content' onClick={type !== 'user' ? () => showProfile() : null}>
          {name && <span className='entities__entity__content__title'>{name || ' '}</span>}
          {metadata && metadata.firstName && <span className='entities__entity__content__title'>{`${metadata.firstName} ${metadata.lastName}` || ' '}</span>}
          {businessType && <div className='entities__entity__content__type'>{businessType}</div>}
          <div className='entities__entity__content__subtitle'>
            <span className='text-asset'>Account ID</span>
            <a onClick={e => e.stopPropagation()} href={`${getBlockExplorerUrl('fuse')}/address/${account}`} target='_blank'>
              <span className='id'>{!isMobile ? account : formatAddress(account)}</span>
            </a>
            <CopyToClipboard text={account}>
              <FontAwesome name='clone' />
            </CopyToClipboard>
          </div>
        </div>
        {
          isAdmin && (
            <div
              className='entities__entity__more'
              ref={this.setDropdownRef}
              onClick={(e) => {
                e.stopPropagation()
                this.setState({ isOpen: !isOpen })
              }}
            >
              <FontAwesome name='ellipsis-v' />
              <div className={classNames('more', { 'more--show': isOpen })} onClick={e => e.stopPropagation()}>
                {
                  type === 'business' && (
                    <ul className='more__options'>
                      <li className='more__options__item' onClick={() => handleRemove(account)}>Remove</li>
                    </ul>
                  )
                }
                {
                  type === 'user' && isApproved && !hasAdminRole && (
                    <ul className='more__options'>
                      <li className='more__options__item' onClick={() => handleRemove(account)}>Remove</li>
                      <li className='more__options__item' onClick={() => addAdminRole(account)}>Make admin</li>
                    </ul>
                  )
                }
                {
                  type === 'user' && hasAdminRole && isApproved && (
                    <ul className='more__options'>
                      <li className='more__options__item' onClick={() => handleRemove(account)}>Remove</li>
                      <li className='more__options__item' onClick={() => removeAdminRole(account)}>Remove as admin</li>
                    </ul>
                  )
                }
                {
                  type === 'user' && !isApproved && !hasAdminRole && (
                    <ul className='more__options'>
                      <li className='more__options__item' onClick={() => confirmUser(account)}>Confirm</li>
                      <li className='more__options__item' onClick={() => addAdminRole(account)}>Make admin</li>
                    </ul>
                  )
                }
              </div>
            </div>
          )
        }
      </div>

    )
  }
}
