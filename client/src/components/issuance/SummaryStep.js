import React, { Component } from 'react'
import classNames from 'classnames'
import FontAwesome from 'react-fontawesome'
import Arrow from 'images/arrow.png'

const SummaryStep = ({communityLogo, renderCurrencySymbol, totalSupply, setDoneHandler}) => {
  return [
      <h2 className='step-content-title text-center'>Your community currency is ready to use!</h2>,
      <div className='step-content-summary'>
        <div className='step-content-summary-header'>
          <div className='step-content-summary-status'>
            <span className='step-content-summary-status-point'></span>
            not active
          </div>
          <button className='btn-reload'>
            <img src={Arrow} className='reload-img' />
          </button>
        </div>
        <div className='step-content-summary-container'>
          <div className='step-content-summary-logo'>
            <img src={communityLogo} className='logo-img' />
            <span className='symbol-text'>{renderCurrencySymbol}</span>
          </div>
          <div className='step-content-summary-title'>'dvdvdvdsbsbsdfbfd'</div>
          <div className='step-content-summary-footer'>
            <div className='step-content-summary-total-title'>Total cc supply</div>
            <div className='footer-supply'>
              <div className='step-content-summary-total'>
                {new Intl.NumberFormat('en-US', {
                  style: 'decimal',
                  minimumFractionDigits: 0
                }).format(totalSupply)}
              </div>
              <div className='add-btn'>add cln <span className="add-icon"><FontAwesome  name="plus" /></span></div>
            </div>
          </div>
        </div>
      </div>,
      <div className='text-center wallet-container'>
        <button className='btn-download'>
          <FontAwesome  name="download" /> Metamask wallet
        </button>
      </div>,
      <div className='text-center'>
        <button
          className="symbol-btn"
          onClick={setDoneHandler}
        >
          Done
        </button>
      </div>
  ]
}

export default SummaryStep;
