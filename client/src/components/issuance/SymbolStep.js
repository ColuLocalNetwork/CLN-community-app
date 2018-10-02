import React from 'react'
import FontAwesome from 'react-fontawesome'

const SymbolStep = ({communityName, renderCurrencySymbol, setNextStep}) => {
  return (
    <div className='step-content-symbol'>
      <h2 className='step-symbol-title'>{'\'' + communityName + '\''}</h2>
      <h2 className='step-content-title'>Currency Symbol</h2>
      <div className='step-content-symbol-field'>{renderCurrencySymbol}</div>
      <div className='text-center'>
        <button className='btn-download edit-symbol'>
          <FontAwesome name='edit' /> Edit
        </button>
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
