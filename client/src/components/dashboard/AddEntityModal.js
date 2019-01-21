import React, {Component} from 'react'
import Modal from 'components/Modal'
import FontAwesome from 'react-fontawesome'
import Select from 'react-select'
import DynamicImg from 'images/dynamicdash.png'

class AddEntityModal extends Component {
  state = {
    selectedBusinessType: ''
  }
  constructor (props) {
    super(props)
    this.handleSelectChange = this.handleSelectChange.bind(this)
  }
  handleSelectChange = selectedBusinessType => {
    this.setState({ selectedBusinessType })
    console.log(`Option selected:`, selectedBusinessType)
  }
  render () {
    const options = [
      { value: 'pets', label: 'Pets' },
      { value: 'education', label: 'Education' },
      { value: 'fashion', label: 'Fashion' }
    ]
    const { selectedBusinessType } = this.state
    console.log(this.state)
    return (
      <Modal className='entity-modal' onClose={this.props.hideModal}>
        <div className='entity-modal-media'>
          <h3 className='entity-modal-media-title'>
            Bring Your Business to Fuse
          </h3>
          <img className='entity-modal-media-img' src={DynamicImg} />
        </div>
        <div className='entity-modal-content'>
          <h4 className='entity-modal-title'>
            Business name
          </h4>
          <input
            type='text'
            className='entity-modal-business-name'
            placeholder='Your business name...'
          />
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
              <div className='entity-modal-content-types'>
                <span className='entity-modal-content-type'>Food & Beverages</span>
                <span className='entity-modal-content-type'>Sports</span>
                <span className='entity-modal-content-type'>Tesh</span>
                <span className='entity-modal-content-type'>Volunteer</span>
                <span className='entity-modal-content-type'>Design & Home</span>
                <Select
                  className='entity-modal-content-select'
                  classNamePrefix='entity-modal-content-select-prefix'
                  value={selectedBusinessType}
                  options={options}
                  placeholder={'Other...'}
                  onChange={this.handleSelectChange}
                />
              </div>
            </div>
          </div>
          <hr />
          <div className='row'>
            <div className='col-7'>
              <p className='entity-modal-content-label'>
                Contact info
              </p>
              <div className='row'>
                <div className='col-4'>
                  <p className='entity-modal-content-form-control-label'>
                    Business Address
                  </p>
                </div>
                <div className='col-8'>
                  <input
                    className='entity-modal-content-form-control'
                    placeholder='Type...'
                  />
                </div>
              </div>
              <div className='row'>
                <div className='col-4'>
                  <p className='entity-modal-content-form-control-label'>
                    Business email
                  </p>
                </div>
                <div className='col-8'>
                  <input
                    className='entity-modal-content-form-control'
                    placeholder='Type...'
                  />
                </div>
              </div>
              <div className='row'>
                <div className='col-4'>
                  <p className='entity-modal-content-form-control-label'>
                    Phone
                  </p>
                </div>
                <div className='col-8'>
                  <input
                    className='entity-modal-content-form-control'
                    placeholder='Type...'
                  />
                </div>
              </div>
              <div className='row'>
                <div className='col-4'>
                  <p className='entity-modal-content-form-control-label'>
                    Website link...
                  </p>
                </div>
                <div className='col-8'>
                  <input
                    className='entity-modal-content-form-control'
                    placeholder='Type...'
                  />
                </div>
              </div>
            </div>
            <div className='col-5'>
              <p className='entity-modal-content-label'>
                Description
                <span className='entity-modal-content-label-type'>0/490</span>
              </p>
              <textarea className='entity-modal-content-form-control' rows='10' />
            </div>
          </div>
          <div className='row justify-center'>
            <div className='col-3'>
              <button className='btn-add-entity'>Save</button>
            </div>
          </div>
        </div>
      </Modal>
    )
  }
}

export default AddEntityModal
