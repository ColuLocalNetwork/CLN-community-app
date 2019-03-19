import React from 'react'
import Modal from 'components/Modal'
import GenericHeader from 'images/generic-header.png'

const GenericModal = (props) =>
  <Modal className='generic-modal' onClose={props.hideModal}>
    <div className='generic-modal-header'>
      <img src={GenericHeader} className='generic-modal-header-img' />
    </div>
    <div className='generic-modal-container'>
      <div className='generic-modal-title'>
        Something about Metamask
      </div>
      <div className='generic-modal-text'>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin luctus pretium placerat. Morbi quis quam ac massa mattis efficitur. Donec nec nibh sodales libero convallis eleifend ut in lectus
      </div>
      <button className='dashboard-transfer-btn'>Deploy a list</button>
    </div>
  </Modal>

export default GenericModal
