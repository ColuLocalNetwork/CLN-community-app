import React from 'react'
import Modal from 'components/Modal'
import Media from 'images/issue-popup.svg'
import CountriesList from './CountriesList'

const MetamaskModal = (props) => {
  return (
    <Modal className='issued-popup' onClose={props.hideModal}>
      <div className='issued-popup-media'>
        <h3 className='issued-popup-media-title'>Congratulation, a new crypto was born</h3>
        <img className='issued-popup-media-img' src={Media} />
      </div>
      <div className='issued-popup-container'>
        <p className='issued-popup-text'>Lets continue this wonderful relationship</p>
        <div className='form-control'>
          <label>Full Name</label>
          <input
            id='userName'
            type='text'
            placeholder='Type your name'
            value={props.userName}
            onChange={props.setUserName}
          />
        </div>
        <div className='form-control'>
          <label>Email Address</label>
          <input
            className={((props.userEmail === '') || props.validateEmail()) ? 'form-control-input' : 'form-control-error'}
            id='userEmail'
            type='email'
            placeholder='Type your email'
            value={props.userEmail}
            onChange={props.setUserEmail}
          />
        </div>
        <div className='form-control'>
          <label>Country</label>
          <select
            onChange={props.setCountry}
            defaultValue='Select Country'
          >
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
            onChange={props.setGettingEmail}
            checked={props.gettingEmail}
          />
          <label className='checkbox-label' htmlFor='email'>
            I agree to receive fuse emails
          </label>
        </div>
        <button
          disabled={!props.setGettingEmail}
          className='issued-popup-btn'
          onClick={props.setUserInform}
        >
          Done
        </button>
      </div>
    </Modal>
  )
}

export default MetamaskModal
