import React from 'react'
import Modal from 'components/Modal'
import FontAwesome from 'react-fontawesome'
import EntityForm from './EntityForm'

const AddEntityModal = (props) =>
  <Modal className='entity-modal' onClose={props.hideModal}>
    <div className='entity-modal-media'>
      <h3 className='entity-modal-title'>
        Bring Your Business to Fuse
      </h3>
    </div>
    <div className='entity-modal-content'>
      <h4 className='entity-modal-title'>
        Business name
      </h4>
      <input type='text' className='entity-modal-business-name' />
      <div className='row'>
        <div className='col-3'>
          <p className='entity-modal-content-label'>
            Logo <FontAwesome name='info-circle' />
          </p>
          <div className='entity-modal-content-upload'>
            <div className='entity-modal-content-upload-text'>
              <FontAwesome name='arrow-circle-up' />
              Upload
            </div>
          </div>
        </div>
        <div className='col-4'>
          <p className='entity-modal-content-label'>
            Picture <FontAwesome name='info-circle' />
          </p>
          <div className='entity-modal-content-upload'>
            <div className='entity-modal-content-upload-text'>
              <FontAwesome name='arrow-circle-up' />
              Upload
            </div>
          </div>
        </div>
        <div className='col-5'>
          <p className='entity-modal-content-label'>
            Business Type <span>Select one</span>
          </p>
        </div>
      </div>
      <hr />
    </div>
    <EntityForm addEntity={props.handleAddEntity} />
  </Modal>

export default AddEntityModal
