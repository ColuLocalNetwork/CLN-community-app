import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import get from 'lodash/get'
import Select from 'react-select'
import { Formik, Field } from 'formik'
import entityShape from 'utils/validation/shapes/entity'
import { businessTypes, options } from 'constants/dropdownOptions'

class EntityForm extends Component {

  constructor(props) {
    super(props)

    const { entity } = props

    console.log({entity});
    
    this.initialValues = {
      name: '',
      address: '',
      email: '',
      phone: '',
      websiteUrl: '',
      description: '',
      type: '',
      account: '',
      selectedBusinessType: {}
    }

    this.validationSchema = entityShape
  }

  componentDidMount() {
    if (this.props.entity) {
      this.setState(this.props.entity)
    }
  }

  onSubmit = (values, form) => {
    console.log({values});
    this.props.submitEntity(values)
  }

  renderForm = (form) => {

    const { errors, touched, handleSubmit, setFieldValue, setFieldTouched, values } = form

    console.log({ errors, values });

    const modalContentSelectClass = classNames({
      'entity-modal-content-select': true,
      'active-business-select': values.businessType === values.selectedBusinessType.value
    })

    return (
      <form className='entity-modal-content' onSubmit={handleSubmit} noValidate>
        <h4 className='entity-modal-title' key={0}>
          Business name
      </h4>
        <Field
          onFocus={() => setFieldTouched('name', true)}
          name="name"
          type='text'
          className='entity-modal-business-name'
          placeholder='Your business name...'
        />
        <div className='row'>
          <div className='col-12'>
            <p className='entity-modal-content-label'>
              Business Type <span>Select one</span>
            </p>
            <div className='entity-modal-content-types'>
              {
                businessTypes().map(({ value, label }, key) =>
                  <Field
                    name="businessType"
                    key={key}
                    render={({ field }) => (
                      <span
                        {...field}
                        className={classNames({
                          'entity-modal-content-type': true,
                          'active-business-type': values.businessType === value
                        })}
                        onClick={() => setFieldValue('businessType', value)}
                      >
                        {label}
                      </span>
                    )}
                  />
                )
              }
              <Select
                name="businessType"
                className={modalContentSelectClass}
                classNamePrefix='entity-modal-content-select-prefix'
                value={values.businessTypes}
                options={options()}
                placeholder={'Other...'}
                onChange={({ value, ...rest }) => {
                  setFieldValue('selectedBusinessType', {value, ...rest})
                  setFieldValue('businessType', value)
                }}
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
                  Business Account
            </p>
              </div>
              <div className='col-8'>
                <Field
                  type='text'
                  name='account'
                  className='entity-modal-content-form-control'
                  placeholder='Type...'
                  onFocus={() => setFieldTouched('account', true)}
                />
              </div>
            </div>
            <div className='row'>
              <div className='col-4'>
                <p className='entity-modal-content-form-control-label'>
                  Business Address
            </p>
              </div>
              <div className='col-8'>
                <Field
                  type='text'
                  name='address'
                  className='entity-modal-content-form-control'
                  placeholder='Type...'
                  onFocus={() => setFieldTouched('address', true)}
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
                <Field
                  type='email'
                  name='email'
                  className='entity-modal-content-form-control'
                  placeholder='Type...'
                  onFocus={() => setFieldTouched('email', true)}
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
                <Field
                  type='text'
                  name='phone'
                  className='entity-modal-content-form-control'
                  placeholder='Type...'
                  onFocus={() => setFieldTouched('phone', true)}
                />
              </div>
            </div>
            <div className='row'>
              <div className='col-4'>
                <p className='entity-modal-content-form-control-label'>
                  Website link
            </p>
              </div>
              <div className='col-8'>
                <Field
                  type='text'
                  name='websiteUrl'
                  className='entity-modal-content-form-control'
                  placeholder='Type...'
                  onFocus={() => setFieldTouched('websiteUrl', true)}
                />
              </div>
            </div>
          </div>
          <div className='col-5'>
            <p className='entity-modal-content-label'>
              Description
          <span className='entity-modal-content-label-type'>{values.description.length}/490</span>
            </p>
            <Field
              name="description"
              render={({ field }) => <textarea className='entity-modal-content-form-control' {...field} rows='14' />}
            />
          </div>
        </div>
        <div className='row justify-center'>
          <div className='col-12'>
            <button type="submit" className='btn-add-entity'>Save</button>
          </div>
        </div>
      </form>
    )
  }

  render() {
    return (
      <Formik
        initialValues={this.initialValues}
        validationSchema={this.validationSchema}
        render={this.renderForm}
        onSubmit={this.onSubmit}
      />
    )
  }
}

EntityForm.propTypes = {
  submitEntity: PropTypes.func.isRequired
}

export default EntityForm
