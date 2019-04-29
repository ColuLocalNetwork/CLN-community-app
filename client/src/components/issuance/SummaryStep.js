import React, { Component } from 'react'
import PropTypes from 'prop-types'
import BigNumber from 'bignumber.js'
import Loader from 'components/Loader'
import { REQUEST, PENDING, SUCCESS, FAILURE, CONFIRMATION } from 'actions/constants'
import ReactGA from 'services/ga'
import CommunityLogo from 'components/elements/CommunityLogo'
import TransactionButton from 'components/common/TransactionButton'
import Message from 'components/common/Message'

export default class SummaryStep extends Component {
  state = {
    showError: true
  }

  renderTransactionStatus = (transactionStatus) => {
    switch (transactionStatus) {
      case REQUEST:
        return (<button className='button button--normal' disabled>
          Issue
        </button>)
      case PENDING:
        return <Loader color='#3a3269' className='loader' />
      case SUCCESS:
        return null
      default:
        return (
          <TransactionButton clickHandler={this.props.showPopup} frontText='ISSUE' />
        )
    }
  }

  getToken = () => ({
    symbol: this.props.communitySymbol,
    name: this.props.communityName,
    totalSupply: new BigNumber(this.props.totalSupply.toString()).multipliedBy(1e18)
  })

  componentDidMount() {
    ReactGA.event({
      category: 'Issuance',
      action: 'Load',
      label: 'Finished'
    })
  }

  componentDidUpdate(prevProps) {
    if (this.transactionStatus === SUCCESS && prevProps.transactionStatus !== SUCCESS) {
      ReactGA.event({
        category: 'Issuance',
        action: 'Load',
        label: 'Issued'
      })
    }
  }
  
  render() {
    const { networkType, communitySymbol, communityLogo, totalSupply, communityName, contracts, createTokenSignature, transactionStatus, setNextStep } = this.props

    const { showError } = this.state

    const contractsItems = Object.keys(contracts)
      .filter((contractName) => contracts[contractName].checked)
      .map((contractName) => contracts[contractName].label)
    
    if (transactionStatus === PENDING) {
      setNextStep()
      return ''
    }

    return (
      <div className='summary-step'>
        <div className='summary-step__wrapper'>
          <div className='summary-step__logo'>
            <CommunityLogo networkType={networkType} token={{ symbol: communitySymbol }} metadata={{ communityLogo }} />
            <span>{communityName} coin</span>
          </div>
          <hr className='summary-step__line' />
          <div className='summary-step__content'>
            <div className='summary-step__content__item'>
              <h4 className='summary-step__content__title'>Currency type</h4>
              <p>Mintable burnable token</p>
            </div>
            <div className='summary-step__content__item'>
              <h4 className='summary-step__content__title'>Total supply</h4>
              <p>{totalSupply}</p>
            </div>
            <div className='summary-step__content__item'>
              <h4 className='summary-step__content__title'>Contracts</h4>
              <div>
                <ul>
                  {contractsItems.map(item => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </div>
          </div>
          <Message
            isOpen={createTokenSignature}
            message='Pending'
            isDark
          />
          <Message
            isOpen={transactionStatus === FAILURE && showError}
            message='Something went wrong'
            clickHandler={() => this.setState({showError: false})}
            subTitle='Try again later'
          />
        </div>
        <div className='grid-x align-center summary-step__issue'>
          {this.renderTransactionStatus(this.props.transactionStatus)}
        </div>
      </div>
    )
  }
}

SummaryStep.propTypes = {
  transactionStatus: PropTypes.string
}
