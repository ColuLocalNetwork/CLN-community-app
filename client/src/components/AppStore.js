import React, { Component } from 'react'
import TopNav from 'components/TopNav'
import AppstoreBanner from 'images/appstoreBanner.png'

export default class AppStore extends Component {
  showHomePage = (address) => {
    this.props.history.push('/')
  }
  render () {
    return (
      <React.Fragment>
        <TopNav
          active
          history={this.props.history}
          type={'appstore'}
        />
        <div className='appstore-container'>
          <div className='appstore-banner'>
            <div className='appstore-banner-content'>
              <h2 className='appstore-banner-title'>Welcome to App store</h2>
            </div>
            <img src={AppstoreBanner} />
          </div>
        </div>
      </React.Fragment>
    )
  }
}
