import React, {Component} from 'react'
import {connect} from 'react-redux'
import { BigNumber } from 'bignumber.js'
import FontAwesome from 'react-fontawesome'
import classNames from 'classnames'
import StepsIndicator from './StepsIndicator'
import NameStep from './NameStep'
import SymbolStep from './SymbolStep'
import DetailsStep from './DetailsStep'
import SummaryStep from './SummaryStep'
import * as actions from 'actions/ui'

//import * as actions from 'actions/communities'

class IssuanceFactory extends Component {
  constructor(props) {
    super(props);
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
    this.handleChangeCommunityName = this.handleChangeCommunityName.bind(this);
  }
  componentDidMount() {
    if(window) {
      window.addEventListener('scroll', this.handleScroll);
      //this.stepIndicator.addEventListener('scroll', console.log());
      this.setState({ stepPosition: this.stepIndicator.getBoundingClientRect().top})
    }
  }

  componentWillUnmount() {
    if (window && this.props.ui.scrollPosition) {
      window.removeEventListener('scroll', this.handleScroll, false);
    }
  }

  handleScroll = () => {
    //if (process.env.BROWSER) {
    //console.log('------handleScroll-------');
    //console.log(window.scrollY);
    this.props.setScrollPosition(window.scrollY);

    /*if (this.props.ui.scrollPosition > this.state.stepPosition - 75) {
      this.setState({ isSticky: true})
    } else { this.setState({ isSticky: false}) }*/
    (this.props.ui.scrollPosition > this.state.stepPosition - 75) ? this.setState({ isSticky: true}) : this.setState({ isSticky: false});
  }

  /*createCurrency = () => {
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
  }*/

  setQuitIssuance() {
    this.props.history.goBack()
  }

  handleChangeCommunityName(event) {
    this.setState({communityName: event.target.value});
  }

  setPreviousStep() {
    this.setState({
      activeStep: this.state.activeStep - 1
    });
  }

  setNextStep() {
    this.setState({
      doneStep: this.state.activeStep,
      activeStep: this.state.activeStep + 1
    });
  }

  setDoneHandler() {
    this.props.history.push('/')
  }

  setCommunityType = type =>
    this.setState({communityType: type})

  setTotalSupply = supply =>
    this.setState({totalSupply: supply})

  setCommunityLogo = logo =>
    this.setState({communityLogo: logo})

  renderCurrencySymbol(name) {
    const nameArr = name.split(' ');
    switch(nameArr.length) {
      case 1: return nameArr[0].substring(0, 3);
      case 2: return nameArr[0].substring(0, 2) + nameArr[1].substring(0, 1);
      case 3: return nameArr[0].substring(0, 1) + nameArr[1].substring(0, 1) + nameArr[2].substring(0, 1);
      case 4: return nameArr[0].substring(0, 2) + nameArr[1].substring(0, 2);
      default: return nameArr[0].substring(0, 2) + nameArr[1].substring(0, 2);
    }
  }

  renderStepContent(activeStep, name) {
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
            renderCurrencySymbol={this.renderCurrencySymbol(name)}
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
            renderCurrencySymbol={this.renderCurrencySymbol(name)}
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
              renderCurrencySymbol={this.renderCurrencySymbol(name)}
              setDoneHandler={() => this.setDoneHandler()}
            />
        )
    }
  }

  render() {
    const steps = ["Name", "Symbol", "Details", "Summary"];
    //console.log(this.stepIndicator);
    //console.log(this.props.ui.set);
    //console.log('---------Issuance---------');
    //console.log(this.stepIndicator.getBoundingClientRect());
    //console.log(this.props.ui);
    console.log(this.state.stepPosition.top);
    console.log('---------isSticky---------');

    //console.log(this.state.stepPosition.top < 51);
    console.log(this.state.isSticky);
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
              className="prev-button ctrl-btn"
              onClick={() => this.setPreviousStep()}
            >
              <FontAwesome className="ctrl-icon" name="arrow-left" />
              <span className="btn-text">Back</span>
            </button>}
            <button
              className="quit-button ctrl-btn"
              onClick={() => this.setQuitIssuance()}
            >
              <FontAwesome className="ctrl-icon" name="times" />
              <span className="btn-text">Quit</span>
            </button>
          </div>
          <div className={stepsContainerClassStyle} >
            <div className={stepsIndicatorClassStyle} ref={stepIndicator => (this.stepIndicator = stepIndicator)}>
              <StepsIndicator
                steps={steps}
                activeStep = {this.state.activeStep}
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


export default connect(mapStateToProps, actions)(IssuanceFactory)
