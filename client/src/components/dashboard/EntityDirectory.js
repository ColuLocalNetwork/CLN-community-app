import React, { Component } from 'react'
import FontAwesome from 'react-fontawesome'
import { connect } from 'react-redux'
import {createList} from 'actions/list'
import ClnIcon from 'images/cln.png'

class EntityDirectory extends Component {
  setQuitDashboard = () => this.props.history.goBack()

  render () {
    return (
      <div className='dashboard-content'>
        <div className='dashboard-header'>
          <div className='dashboard-logo'>
            <a href='https://cln.network/' target='_blank'><img src={ClnIcon} /></a>
          </div>
          <button
            className='quit-button ctrl-btn'
            onClick={this.setQuitDashboard}
          >
            <FontAwesome className='ctrl-icon' name='times' />
          </button>
        </div>
        <div className='dashboard-container'>
          EntityDirectory
          <button onClick={this.props.createList}>Create List</button>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = {
  createList
}

export default connect(null, mapDispatchToProps)(EntityDirectory)
