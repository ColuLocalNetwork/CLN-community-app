import React, { PureComponent } from 'react'
import { Formik, Field } from 'formik'
import { object, string, number } from 'yup'
import TransactionButton from 'components/common/TransactionButton'
import Message from 'components/common/Message'

export default class TransferForm extends PureComponent {
  constructor (props) {
    super(props)

    this.initialValues = {
      to: '',
      amount: ''
    }

    this.validationSchema = object().shape({
      to: string().normalize().label('To').required(),
      amount: string().matches(/^\d+$/, 'Only numbers').label('Amount').required()
    })
  }

  onSubmit = async (values, { resetForm }) => {
    const { handleTransper } = this.props

    const { to, amount } = values

    await handleTransper({ to, amount })
    resetForm()
  }

  renderForm = ({ handleSubmit, setFieldValue, setFieldTouched, values, errors }) => {
    const {
      transactionStatus,
      transferMessage,
      closeMessage
    } = this.props

    return (
      <form className='transfer-tab__content' onSubmit={handleSubmit}>

        <Message
          message={'Your money has been sent successfully'}
          isOpen={transactionStatus && (transactionStatus === 'SUCCESS' || transactionStatus === 'CONFIRMATION') && transferMessage}
          clickHandler={closeMessage}
          subTitle=''
        />
        <Message
          message={'Oops, something went wrong'}
          subTitle=''
          isOpen={transactionStatus && transactionStatus === 'FAILURE' && transferMessage}
          clickHandler={closeMessage}
        />

        <div className='transfer-tab__content__to-field'>
          <span className='transfer-tab__content__to-field__text'>To</span>
          <Field 
            onFocus={() => setFieldTouched('to', true)}
            name='to'
            className='transfer-tab__content__to-field__input'
          />
          { errors && errors.to && <span className='input-error'>{errors.to}</span> }
        </div>
        <div className='transfer-tab__content__amount'>
          <span className='transfer-tab__content__amount__text'>Amount</span>
          <Field
            onFocus={() => setFieldTouched('amount', true)}
            name='amount'
            className='transfer-tab__content__amount__field'
          />
          { errors && errors.amount && <span className='input-error'>{errors.amount}</span> }
        </div>

        <div className='transfer-tab__content__button'>
          <TransactionButton type='submit' />
        </div>
      </form>
    )
  }

  render () {
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
