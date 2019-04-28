import React, { PureComponent } from 'react'
import FuseLoader from 'images/loader-fuse.gif'
import classNames from 'classnames'

const deployProgress = [
  {
    label: 'Issuing community currency',
    loaderText: 'Your asset is being deployed as an ERC-20 contract to Ethereum mainnet',
    key: 'tokenIssued'
  },
  {
    label: 'Deploying bridge contract',
    loaderText: 'A bridge contract is being deployed for the community currency on mainnet and the Fuse sidechain',
    key: 'bridgeDeployed'
  },
  {
    label: 'Deploying member list contract',
    loaderText: 'The members list is deployed on the Fuse sidechain to allow adding users to the community',
    key: 'membersList'
  }
]

export default class DeployProgress extends PureComponent {
  render () {
    const {
      currentDeploy
    } = this.props

    return (
      <div className='progress__wrapper'>
        <div className='progress__img'>
          <img src={FuseLoader} alt='Fuse loader' />
        </div>
        {
          deployProgress.map(({ label, loaderText, key }) => {
            return (
              <div key={key} className={classNames('progress__item', { 'progress__item--active': currentDeploy === key })}>
                <div className={classNames('progress__item__label')}>{label}</div>
                <div className='progress__item__loaderText'>{loaderText}</div>
              </div>
            )
          })
        }
      </div>
    )
  }
}
