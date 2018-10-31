import React, {Component} from 'react'
import classNames from 'classnames'
import FontAwesome from 'react-fontawesome'
import Calculator from 'images/Calculator.svg'

export default class SummaryStep extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activeStatus: true
    }
  }
  toggleStatus = () => {
    this.setState({activeStatus: !this.state.activeStatus})
  }
  render () {
    const coinStatusClassStyle = classNames({
      'coin-status': true,
      'coin-status-active': this.state.activeStatus,
      'coin-status-close': !this.state.activeStatus
    })
    return [
      <h2 key={0} className='step-content-title text-center'>Your community currency is ready to be born!</h2>,
      <div key={1} className='step-content-summary'>
        <div className='list-item' >
          <div className='coin-wrapper'>
            <div className='coin-header'>
              <div className='coin-logo'>
                <img src={this.props.communityLogo} className='logo-img' />
                <span className='symbol-text'>{this.props.communitySymbol}</span>
              </div>
              <div className='coin-details'>
                <h3 className='coin-name'>{this.props.communityName}</h3>
                <p className='coin-total'>Total CC supply <span className='total-text'>{this.props.totalSupply}</span></p>
                <button className='btn-calculator'>
                  <img src={Calculator} />
                </button>
                <div className={coinStatusClassStyle} onClick={() => this.toggleStatus()}>
                  <span className='coin-status-indicator' /> <span className='coin-status-text'>{this.state.activeStatus ? 'open to public' : 'close to public'}</span>
                </div>
              </div>
            </div>
            <div className='coin-footer'>
              <div className='coin-content'>
                <div className='total-content'>CLN Reserved</div>
                <button className='btn-adding'>
                  <FontAwesome name='plus' className='top-nav-issuance-plus' /> Add CLN
                </button>
              </div>
              <div className='coin-content'>
                <div>
                  <span className='coin-currency-type'>USD</span>
                  <span className='coin-currency'>0</span>
                </div>
                <div>
                  <span className='coin-currency-type'>CLN</span>
                  <span className='coin-currency'>0</span>
                </div>
              </div>
            </div>
          </div>
          <div className='coin-footer-close'>
            <FontAwesome name='times-circle' /> Close
          </div>
        </div>
      </div>,
      <div key={3} className='text-center wallet-container'>
        <a href='https://metamask.io/' target='_blank' className='btn-download'>
          <FontAwesome name='download' /> Metamask wallet
        </a>
      </div>,
      <div key={4} className='text-center'>
        <button onClick={this.props.showPopup} className='symbol-btn' disabled={this.props.disabledDoneBtn}>
          Done
        </button>
      </div>
    ]
  }
}
