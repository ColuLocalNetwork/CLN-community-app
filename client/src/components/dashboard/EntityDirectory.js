import React, { Component } from 'react'
import FontAwesome from 'react-fontawesome'
import { connect } from 'react-redux'
import {createList, addEntity, fetchEntities} from 'actions/list'
import ClnIcon from 'images/cln.png'

class EntityDirectory extends Component {
  setQuitDashboard = () => this.props.history.goBack()

  handleAddEntity = () => this.props.addEntity({
    name: 'my business',
    address: 'Tel Aviv'
  })

  handleCreateList = () => this.props.createList(this.props.tokenAddress)

  componentDidMount () {
    this.props.fetchEntities(1)
  }

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
          <button onClick={this.handleCreateList}>Create List</button>
          <button onClick={this.handleAddEntity}>Add Entity</button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, {match}) => ({
  tokenAddress: match.params.address
})

const mapDispatchToProps = {
  createList,
  addEntity,
  fetchEntities
}

export default connect(mapStateToProps, mapDispatchToProps)(EntityDirectory)
