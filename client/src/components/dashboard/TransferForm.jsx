import React, { PureComponent } from 'react'
import { Formik, Field, ErrorMessage } from 'formik'
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
      amount: string().matches(/^\d+$/, 'Only numbers allowed').label('Amount').required()
    })
  }

  onSubmit = async (values, { resetForm }) => {
    const { handleTransper } = this.props

    const { to, amount } = values

    await handleTransper({ to, amount })
    resetForm()
  }

  renderForm = ({ handleSubmit }) => {
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
            name='to'
            className='transfer-tab__content__to-field__input'
          />
          <ErrorMessage name="to" render={msg => <div className='input-error'>{msg}</div>} />
        </div>
        <div className='transfer-tab__content__amount'>
          <span className='transfer-tab__content__amount__text'>Amount</span>
          <Field
            name='amount'
            className='transfer-tab__content__amount__field'
          />
          <ErrorMessage name="amount" render={msg => <div className='input-error'>{msg}</div>} />
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
