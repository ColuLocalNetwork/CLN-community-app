import React, { Component } from 'react'
import FuseLoader from 'images/loader-fuse.gif'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { fetchDeployProgress } from 'actions/token'
import isEmpty from 'lodash/isEmpty'
import FontAwesome from 'react-fontawesome'

const deployProgress = [
  {
    label: 'Issuing community currency',
    loaderText: 'Your asset is being deployed as an ERC-20 contract to Ethereum mainnet',
    key: 'tokenIssued'
  },
  {
    label: 'Deploying bridge contract',
    loaderText: 'A bridge contract is being deployed for the community currency on mainnet and the Fuse sidechain',
    key: 'bridge'
  },
  {
    label: 'Deploying member list contract',
    loaderText: 'The members list is deployed on the Fuse sidechain to allow adding users to the community',
    key: 'membersList'
  }
]

class DeployProgress extends Component {
  componentDidUpdate(prevProps) {
    
    if ((this.props.receipt !== prevProps.receipt) && this.props.receipt) {
      const { fetchDeployProgress, receipt } = this.props
      const tokenAddress = receipt.events[0].address
      fetchDeployProgress({tokenAddress})
      this.getProgress()
    }

    if (this.props.steps !== prevProps.steps) {
      const { steps, tokenAddress, foreignNetwork, stepErrors } = this.props
      const values = Object.values(steps).every(val => val)

      if ((!isEmpty(stepErrors) && (stepErrors.bridge || stepErrors.membersList) || values)) {
        clearInterval(this.interval)
        this.props.history.push(`/view/dashboard/${foreignNetwork}/${tokenAddress}`)
      }
    }
  }

  getProgress = async () => {
    const { fetchDeployProgress, receipt } = this.props
    const tokenAddress = receipt.events[0].address

    this.interval = setInterval(()=> fetchDeployProgress({tokenAddress}), 5000);
  }

  render () {
    const {
      contracts,
      steps
    } = this.props

    let currentStep = null
    
    const isFalsy = Object.values(steps).every(val => !val)
  
    if (isFalsy) {
      currentStep = 'tokenIssued'
    } else {
      currentStep =  Object.keys(steps)
      .filter((contractName) => !Boolean(steps[contractName]))[0]
    }
    
    return (
      <div className='progress__wrapper'>
        <div className='progress__img'>
          <img src={FuseLoader} alt='Fuse loader' />
        </div>
        {
          deployProgress
            .filter(({ key }) => key === 'tokenIssued' || contracts[key].checked)
            .map(({ label, loaderText, key }) => {
              return (
                <div key={key} className={classNames('progress__item', { 'progress__item--active': currentStep === key })}>
                  <div className={classNames('progress__item__label')}>
                    { steps[key] && <FontAwesome name='check' /> }
                    {label}
                  </div>
                  {
                    currentStep === key && <div className='progress__item__loaderText'>{loaderText}</div>
                  }
                </div>
              )
            })
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  ...state.screens.issuance,
  foreignNetwork: state.network.foreignNetwork
})

const mapDispatchToProps = {
  fetchDeployProgress
}

export default connect(mapStateToProps, mapDispatchToProps)(DeployProgress)
