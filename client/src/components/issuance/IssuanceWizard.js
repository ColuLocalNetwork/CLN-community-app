import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'
import { connect } from 'react-redux'
import { BigNumber } from 'bignumber.js'
import classNames from 'classnames'
import { nameToSymbol } from 'utils/format'
import StepsIndicator from './StepsIndicator'
import NameStep from './NameStep'
import SymbolStep from './SymbolStep'
import DetailsStep from './DetailsStep'
import SummaryStep from './SummaryStep'
import DeployProgress from './DeployProgress'
import Contracts from './Contracts'
import { createTokenWithMetadata } from 'actions/token'
import { PENDING } from 'actions/constants'
import ReactGA from 'services/ga'
import Logo from 'components/Logo'

class IssuanceWizard extends Component {
  state = {
    activeStep: 0,
    communityName: '',
    communitySymbol: '',
    customSupply: '',
    communityType: {},
    totalSupply: '',
    communityLogo: {},
    stepPosition: {},
    scrollPosition: 0,
    contracts: {
      bridge: {
        label: 'Bridge to fuse',
        checked: true
      },
      membersList: {
        label: 'Members list',
        checked: false
      },
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
    window.addEventListener('keypress', this.handleKeyPress)
    this.setState({ stepPosition: this.stepIndicator.getBoundingClientRect().top })

    ReactGA.event({
      category: 'Issuance',
      action: 'Load',
      label: 'Started'
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.receipt !== prevProps.receipt) {
      const tokenAddress = this.props.receipt.events[0].address
      this.props.history.push(`/view/dashboard/${this.props.foreignNetwork}/${tokenAddress}`)
    }
  }

  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      switch (this.state.activeStep) {
        case 0: return this.state.communityName.length > 2 ? this.setNextStep() : null
        case 1: return this.setNextStep()
        case 2: return (this.state.customSupply !== '' || this.state.totalSupply !== '') &&
          Object.keys(this.state.communityType).length !== 0 && this.state.communityLogo !== ''
          ? this.setNextStep() : null
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
    window.removeEventListener('keypress', this.handleKeyPress)
  }

  setIssuanceTransaction = () => {
    const tokenData = {
      name: this.state.communityName,
      symbol: this.state.communitySymbol,
      totalSupply: new BigNumber(this.state.totalSupply).multipliedBy(1e18)
    }
    const metadata = { communityLogo: this.state.communityLogo.name }
    this.props.createTokenWithMetadata(tokenData, metadata, this.state.communityType.value)
  }

  handleScroll = () => this.setState({ scrollPosition: window.scrollY })

  setQuitIssuance = () => this.props.history.goBack()

  handleChangeCommunityName = (event) => {
    this.setState({ communityName: event.target.value })
    this.setState({ communitySymbol: nameToSymbol(event.target.value) })
  }

  setPreviousStep = () =>
    this.setState({
      activeStep: this.state.activeStep - 1
    })

  setNextStep = () =>
    this.setState({
      activeStep: this.state.activeStep + 1
    })

  handleChangeCommunitySymbol = (communitySymbol) => {
    this.setState({ communitySymbol })
  }

  showMetamaskPopup = () => this.setIssuanceTransaction()

  setCommunityType = type =>
    this.setState({ communityType: type })

  setTotalSupply = supply =>
    this.setState({ totalSupply: supply })

  setCommunityLogo = logo =>
    this.setState({ communityLogo: logo })

  setContracts = ({ key, value, label }) => {
    const { 
      contracts
    } = this.state

    this.setState({ contracts: { ...contracts, [key]: { ...contracts[key], checked: value } } })
  }

  renderStepContent = () => {
    const {
      transactionStatus,
      createTokenSignature,
      currentDeploy
    } = this.props

    const {
      communityName,
      communityType,
      communityLogo,
      activeStep,
      communitySymbol,
      totalSupply,
      contracts
    } = this.state

    switch (activeStep) {
      case 0:
        return (
          <NameStep
            communityName={communityName}
            handleChangeCommunityName={this.handleChangeCommunityName}
            setNextStep={this.setNextStep}
          />
        )
      case 1:
        return (
          <SymbolStep
            communityName={communityName}
            setNextStep={this.setNextStep}
            handleChangeCommunitySymbol={this.handleChangeCommunitySymbol}
            communitySymbol={communitySymbol}
          />
        )
      case 2:
        return (
          <DetailsStep
            communityType={communityType}
            setCommunityType={this.setCommunityType}
            totalSupply={totalSupply}
            setTotalSupply={this.setTotalSupply}
            communitySymbol={communitySymbol}
            communityLogo={communityLogo}
            setCommunityLogo={this.setCommunityLogo}
            setNextStep={this.setNextStep}
          />
        )
      case 3:
        return (
          <Contracts
            contracts={contracts}
            setContracts={this.setContracts}
            setNextStep={this.setNextStep}
          />
        )
      case 4:
        return (
          <SummaryStep
            createTokenSignature={createTokenSignature}
            contracts={contracts}
            communityName={name}
            communityLogo={communityLogo.name}
            totalSupply={totalSupply}
            communitySymbol={communitySymbol}
            setNextStep={this.setNextStep}
            showPopup={this.showMetamaskPopup}
            transactionStatus={transactionStatus}
          />
        )
      case 5:
        return (
          <DeployProgress
            currentDeploy={currentDeploy}
          />
        )
    }
  }

  render() {
    const { history, foreignNetwork } = this.props
    const steps = ['Name', 'Symbol', 'Attributes', 'Contracts', 'Summary']
    classNames(`issuance-${foreignNetwork}`)
    return (
      <div className={classNames(`issuance-${foreignNetwork}__wrapper`)}>
        <div className={classNames(`issuance-${foreignNetwork}__header grid-x align-middle align-justify`)}>
          <div onClick={() => history.push('/')} className={classNames(`issuance-${foreignNetwork}__header__logo grid-x align-middle`)}>
            <Logo />
          </div>
          <div className={classNames(`issuance-${foreignNetwork}__header__indicators grid-x cell align-center`)} ref={stepIndicator => (this.stepIndicator = stepIndicator)}>
            <div className='grid-y cell auto'>
              <h4 className={classNames(`issuance-${foreignNetwork}__header__current`)}>{steps[this.state.activeStep]}</h4>
              <div className='grid-x align-center'>
                <StepsIndicator
                  network={foreignNetwork}
                  steps={steps}
                  activeStep={this.state.activeStep}
                />
              </div>
            </div>
          </div>
          <div onClick={this.setQuitIssuance} className={classNames(`issuance-${foreignNetwork}__header__close grid-x align-middle align-right`)}>
            <FontAwesome name='times' />
          </div>
        </div>
        <div className={classNames(`issuance-${foreignNetwork}__wizard`)}>
          {this.renderStepContent()}
          {
            this.state.activeStep > 0 && this.state.activeStep < 4 && (
              <div className='text-center'>
                <button
                  className={classNames(`issuance-${foreignNetwork}__wizard__back`)}
                  onClick={this.setPreviousStep}>Back
                  </button>
              </div>
            )
          }
        </div>
      </div>
    )
  }
}

IssuanceWizard.propTypes = {
  transactionHash: PropTypes.string,
  receipt: PropTypes.object,
  transactionStatus: PropTypes.string
}

const mapStateToProps = (state) => ({
  ...state.screens.issuance,
  foreignNetwork: state.network.foreignNetwork
})

const mapDispatchToProps = {
  createTokenWithMetadata
}

export default connect(mapStateToProps, mapDispatchToProps)(IssuanceWizard)
