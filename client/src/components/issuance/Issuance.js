import React, {Component} from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import { BigNumber } from 'bignumber.js'
import FontAwesome from 'react-fontawesome'
import classNames from 'classnames'
import StepsIndicator from './StepsIndicator'
import NameStep from './NameStep'
import SymbolStep from './SymbolStep'
import DetailsStep from './DetailsStep'
import SummaryStep from './SummaryStep'
import { nameToSymbol } from 'utils/format'
import { setScrollPosition } from 'actions/ui'
import * as actionsCommunities from 'actions/communities'

class IssuanceFactory extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activeStep: 0,
      doneStep: null,
      communityName: '',
      customSupply: '',
      communityType: {},
      totalSupply: '',
      communityLogo: '',
      stepPosition: {},
      isSticky: false
    }
    this.handleChangeCommunityName = this.handleChangeCommunityName.bind(this)
  }
  componentDidMount () {
    if (window) {
      window.addEventListener('scroll', this.handleScroll)
      this.setState({ stepPosition: this.stepIndicator.getBoundingClientRect().top })
    }
  }

  componentWillUnmount () {
    if (window && this.props.ui.scrollPosition) {
      window.removeEventListener('scroll', this.handleScroll, false)
    }
  }

  handleScroll = () => {
    this.props.setScrollPosition(window.scrollY);
    (this.props.ui.scrollPosition > this.state.stepPosition - 35) ? this.setState({ isSticky: true }) : this.setState({ isSticky: false })
  }

  createCurrency = () => {
    const currencyData = {
      name: 'TestIssuanceCoin',
      symbol: 'TIC',
      decimals: 18,
      totalSupply: new BigNumber(1e24)
    }
    const communityMetadata =
      {'location':
         {'geo': {'lat': '32.0853', 'lng': '34.7818'}, 'name': 'TLV - JAFFA'},
      'image': 'ipfs://QmPKbrwmzCRZVTsUSe4xKujCKcuMN1NLVi2wNXWNUxqU4L',
      'description': 'TLV - The TLV Coin is the official CLN community coin of Tel Aviv, Israel.',
      'website': 'https : //www.colu.com/community/tel-aviv',
      'social': {'facebook': 'https://www.facebook.com/ColuTelAviv/',
        'instagram': 'https://www.instagram.com/colu_telaviv/'}
      }
    this.props.issueCommunity(communityMetadata, currencyData)
  }

  setQuitIssuance () {
    this.props.history.goBack()
  }

  handleChangeCommunityName (event) {
    this.setState({communityName: event.target.value})
  }

  setPreviousStep () {
    this.setState({
      activeStep: this.state.activeStep - 1
    })
  }

  setNextStep () {
    this.setState({
      doneStep: this.state.activeStep,
      activeStep: this.state.activeStep + 1
    })
  }

  setCommunityType = type =>
    this.setState({communityType: type})

  setTotalSupply = supply =>
    this.setState({totalSupply: supply})

  setCommunityLogo = logo =>
    this.setState({communityLogo: logo})

  renderStepContent (activeStep, name) {
    switch (activeStep) {
      case 0:
        return (
          <NameStep
            communityName={name}
            handleChangeCommunityName={this.handleChangeCommunityName}
            setNextStep={() => this.setNextStep()}
          />
        )
      case 1:
        return (
          <SymbolStep
            communityName={name}
            renderCurrencySymbol={nameToSymbol(name)}
            setNextStep={() => this.setNextStep()}
          />
        )
      case 2:
        return (
          <DetailsStep
            communityType={this.state.communityType}
            setCommunityType={this.setCommunityType}
            totalSupply={this.state.totalSupply}
            setTotalSupply={this.setTotalSupply}
            renderCurrencySymbol={nameToSymbol(name)}
            communityLogo={this.state.communityLogo}
            setCommunityLogo={this.setCommunityLogo}
            showOtherSupply={this.state.showOtherSupply}
            setNextStep={() => this.setNextStep()}
          />
        )
      case 3:
        return (
          <SummaryStep
            communityLogo={this.state.communityLogo}
            totalSupply={this.state.totalSupply}
            renderCurrencySymbol={nameToSymbol(name)}
          />
        )
    }
  }

  render () {
    const steps = ['Name', 'Symbol', 'Details', 'Summary']
    const stepsIndicatorClassStyle = classNames({
      'steps-indicator': true,
      'step-sticky': this.state.isSticky
    })
    const stepsContainerClassStyle = classNames({
      'steps-container': true,
      'step-with-sticky': this.state.isSticky
    })
    return (
      <div className='issuance-form-wrapper' ref={wrapper => (this.wrapper = wrapper)}>
        <div className='issuance-container'>
          <div className='issuance-control'>
            {this.state.activeStep > 0 && <button
              className='prev-button ctrl-btn'
              onClick={() => this.setPreviousStep()}
            >
              <FontAwesome className='ctrl-icon' name='arrow-left' />
              <span className='btn-text'>Back</span>
            </button>}
            <button
              className='quit-button ctrl-btn'
              onClick={() => this.setQuitIssuance()}
            >
              <FontAwesome className='ctrl-icon' name='times' />
              <span className='btn-text'>Quit</span>
            </button>
          </div>
          <div className={stepsContainerClassStyle} >
            <div className={stepsIndicatorClassStyle} ref={stepIndicator => (this.stepIndicator = stepIndicator)}>
              <StepsIndicator
                steps={steps}
                activeStep={this.state.activeStep}
                doneStep={this.state.doneStep}
              />
            </div>
          </div>
          <div className='step-content'>
            {this.renderStepContent(this.state.activeStep, this.state.communityName)}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    ui: state.ui
  }
}
const mapDispatchToProps = dispatch => ({
  actionsCommunities: bindActionCreators(actionsCommunities, dispatch)
})

export default connect(mapStateToProps, {
  setScrollPosition,
  mapDispatchToProps
})(IssuanceFactory)
