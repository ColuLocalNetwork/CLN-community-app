import React, { Component } from 'react'
import classNames from 'classnames'
import ContinueArrow from 'images/continue-arrow.svg'
import TextInput from './../TextInput'

const NameStep = ({communityName, handleChangeCommunityName, setNextStep}) => {
  return (
    <div className='step-content-community'>
      <h2 className='step-content-title community-title'>Name your community</h2>
      <TextInput
        className='step-community-name'
        id='communityName'
        type='text'
        placeholder='Type your community name...'
        value={communityName}
        onChange={handleChangeCommunityName}
      />
      <button
        className="next-button"
        disabled={communityName.length < 3}
        onClick={setNextStep}
      >
        <img src={ContinueArrow} className='next-icon' alt='' />
      </button>
    </div>
  )
}

export default NameStep;
