import React from 'react'
import FontAwesome from 'react-fontawesome'
import CopyToClipboard from 'components/common/CopyToClipboard'
import { getBlockExplorerUrl } from 'utils/network'

const Entity = ({ entity: { name, businessType }, address, showProfile }) =>
  <div className='entities__entity' onClick={() => showProfile()}>
    <div className='entities__entity__logo'>
      <FontAwesome name='bullseye' />
    </div>
    <div className='entities__entity__content'>
      <span className='entities__entity__content__title'>{name}</span>
      {businessType && <div className='entities__entity__content__type'>{businessType}</div>}
      <div className='entities__entity__content__subtitle'>
        <span className='text-asset'>Account ID</span>
        <a onClick={e => e.stopPropagation()} href={`${getBlockExplorerUrl('fuse')}/address/${address}`} target='_blank'>
          <span className='id'>{address}</span>
        </a>
        <CopyToClipboard text={address}>
          <FontAwesome name='clone' />
        </CopyToClipboard>
      </div>
    </div>
    <div className='entities__entity__more'>
      <FontAwesome name='ellipsis-v' />
      <div className='more'>
        {/* <ul className='more__options'>
          <li className='more__options__item'>Confirm</li>
          <li className='more__options__item'>Make admin</li>
        </ul>
        <ul className='more__options'>
          <li className='more__options__item'>Remove</li>
          <li className='more__options__item'>Make admin</li>
        </ul> */}
        <ul className='more__options'>
          <li className='more__options__item'>Remove</li>
          <li className='more__options__item'>Remove as admin</li>
        </ul>
      </div>
    </div>
  </div>

export default Entity
