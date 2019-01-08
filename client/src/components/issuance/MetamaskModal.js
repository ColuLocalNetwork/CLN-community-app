import React, { Component } from 'react'
import Modal from 'components/Modal'
import Media from 'images/issue-popup.svg'
import CountriesList from './CountriesList'

class MetamaskModal extends Component {
  state = {
    selectedCountry: 'Select Country',
    userName: '',
    userEmail: '',
    gettingEmail: true
  }
  setUserName = (e) => this.setState({userName: e.target.value})
  setUserEmail = (e) => this.setState({userEmail: e.target.value})
  setCountry = (e) => this.setState({selectedCountry: e.target.value})
  setGettingEmail = (e) => this.setState({gettingEmail: e.target.checked})

  validateEmail (email) {
    const re = /[a-z0-9!#$%&'*+\/=?^_{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9][a-z0-9-]*[a-z0-9]/
    return re.test(email)
  }

  render () {
    console.log(this.state)
    return (
      <Modal className='issued-popup' onClose={this.props.hideModal}>
        <div className='issued-popup-media'>
          <h3 className='issued-popup-media-title'>Congratulation, a new crypto was born</h3>
          <img className='issued-popup-media-img' src={Media} />
        </div>
        <div className='issued-popup-container'>
          <p className='issued-popup-text'>Lets continue this wonderful relationship</p>
          <div className={((this.state.userEmail === '') || this.validateEmail(this.state.userEmail)) ? 'form-control' : 'form-control form-control-error'}>
            <label>Full Name</label>
            <input
              id='userName'
              type='text'
              placeholder='Type your name'
              value={this.state.userName}
              onChange={this.setUserName}
            />
          </div>
          <div className='form-control'>
            <label>Email Address</label>
            <input
              id='userEmail'
              type='email'
              placeholder='Type your email'
              value={this.state.userEmail}
              onChange={this.setUserEmail}
            />
          </div>
          <div className='form-control'>
            <label>Country</label>
            <select
              onChange={this.setCountry}
              defaultValue='Select Country'
            >
              <option selected='selected' disabled>{this.state.selectedCountry}</option>
              {CountriesList.map((country, key) =>
                <option key={key}>{country}</option>
              )}
            </select>
          </div>
          <div className='form-control'>
            <input
              className='checkbox-input'
              type='checkbox'
              id='email'
              name='email'
              onChange={this.setGettingEmail}
              checked={this.state.gettingEmail}
            />
            <label className='checkbox-label' htmlFor='email'>
              I agree to receive fuse emails
            </label>
          </div>
          <button
            disabled={!this.setGettingEmail || this.state.selectedCountry === '' || this.state.userName === '' || this.state.userEmail === ''}
            className='issued-popup-btn'
          >
            Done
          </button>
        </div>
      </Modal>
    )
  }
}

export default MetamaskModal
