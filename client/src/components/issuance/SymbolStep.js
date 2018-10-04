import React from 'react'
import FontAwesome from 'react-fontawesome'
import TextInput from './../TextInput'

const SymbolStep = ({
  communityName,
  renderCurrencySymbol,
  setNextStep,
  communitySymbol,
  handleChangeCommunitySymbol,
  showCustomSymbol,
  toggleCustomSymbol
}) => {
  return (
    <div className='step-content-symbol'>
      <h2 className='step-symbol-title'>{'\'' + communityName + '\''}</h2>
      <h2 className='step-content-title'>Currency Symbol</h2>
      {!showCustomSymbol
        ? <div className='step-content-symbol-field'>{communitySymbol}</div>
        : <div className='edit-symbol'>
          <TextInput
            className='step-community-name'
            id='communityName'
            type='text'
            placeholder='Type your community name...'
            value={communitySymbol}
            onChange={handleChangeCommunitySymbol}
          />
        </div>
      }
      <div className='text-center'>
        {!showCustomSymbol && <button className='btn-download edit-symbol' onClick={toggleCustomSymbol}>
          <FontAwesome name='edit' /> Edit
        </button>
        }
      </div>
      <button
        className='symbol-btn'
        onClick={setNextStep}
      >
        Approve symbol <FontAwesome name='angle-right' className='symbol-icon' />
      </button>
    </div>
  )
}

export default SymbolStep
