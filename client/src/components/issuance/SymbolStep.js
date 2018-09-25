import React, { Component } from 'react'
import classNames from 'classnames'
import FontAwesome from 'react-fontawesome'

const SymbolStep = ({communityName, renderCurrencySymbol, setNextStep}) => {
  return (
    <div className='step-content-symbol'>
      <h2 className='step-symbol-title'>{'\'' + communityName + '\''}</h2>
      <h2 className='step-content-title'>Currency Symbol</h2>
      <div className='step-content-symbol-field'>{renderCurrencySymbol}</div>
      <button
        className="symbol-btn"
        onClick={setNextStep}
      >
        Approve symbol >
      </button>
    </div>
  )
}

export default SymbolStep;
