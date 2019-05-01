import React, { PureComponent, Fragment } from 'react'
import { Formik, Field } from 'formik'
import { object, string } from 'yup'
import TransactionButton from 'components/common/TransactionButton'
import Message from 'components/common/Message'
import {FAILURE, SUCCESS, CONFIRMATION} from 'actions/constants'
import { isOwner } from 'utils/token'
import upperCase from 'lodash/upperCase'
import classNames from 'classnames'

export default class MintBurnForm extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      actionType: 'mint'
    }

    this.initialValues = {
      mintAmount: '',
      burnAmount: ''
    }

    this.validationSchema = object().shape({
      mintAmount: string().matches(/^\d+$/, 'Only numbers allowed').label('Amount'),
      burnAmount: string().matches(/^\d+$/, 'Only numbers allowed').label('Amount')
    })
  }

  handleMintOrBurn = actionType =>
    this.setState({ actionType })

  onSubmit = async (values, { setFieldError, resetForm }) => {
    const { handleMintOrBurnClick } = this.props
    const {
      actionType
    } = this.state

    if (actionType === 'mint') {
      if (!values.mintAmount) {
        setFieldError('mintAmount', 'Amount is a required field')
        return
      }
    } else if (actionType === 'burn') {
      if (!values.burnAmount) {
        setFieldError('burnAmount', 'Amount is a required field')
        return
      }
    }

    const amount = actionType === 'mint' ? values.mintAmount : values.burnAmount
    await handleMintOrBurnClick(actionType, amount)
    resetForm()
  }

  actionSuccess = () => {
    const { actionType } = this.state
    const { transactionStatus, mintMessage, burnMessage } = this.props
    const sharedCondition = transactionStatus && (transactionStatus === SUCCESS || transactionStatus === CONFIRMATION)
    if (actionType === 'mint') {
      return sharedCondition && mintMessage
    } else {
      return sharedCondition && burnMessage
    }
  }

  actionFailed = () => {
    const { actionType } = this.state
    const { transactionStatus, mintMessage, burnMessage } = this.props
    const sharedCondition = transactionStatus && transactionStatus === FAILURE
    if (actionType === 'mint') {
      return sharedCondition && mintMessage
    } else {
      return sharedCondition && burnMessage
    }
  }

  renderForm = ({ handleSubmit, setFieldValue, setFieldError, setFieldTouched, values, errors, isSubmitting }) => {
    const {
      tokenNetworkType,
      token,
      lastAction,
      accountAddress,
      closeMintMessage,
      closeBurnMessage
    } = this.props

    const {
      actionType
    } = this.state

    return (
      <form className='transfer-tab__content' onSubmit={handleSubmit}>
        <Message
          message={`Your just ${lastAction && lastAction.actionType}ed ${lastAction && lastAction.mintBurnAmount} ${token.symbol} on ${tokenNetworkType} network`}
          isOpen={this.actionSuccess()}
          subTitle=''
          clickHandler={
            actionType === 'mint'
              ? closeMintMessage
              : closeBurnMessage
          }
        />
        <Message
          message={'Oops, something went wrong'}
          isOpen={this.actionFailed()}
          subTitle=''
          clickHandler={
            actionType === 'mint'
              ? closeMintMessage
              : closeBurnMessage
          }
        />
        <div className='transfer-tab__actions'>
          <button
            disabled={!isOwner(token, accountAddress)}
            className={classNames('transfer-tab__actions__btn', { 'transfer-tab__actions__btn--active': actionType === 'mint' })}
            onClick={() => this.handleMintOrBurn('mint')}
          >
          Mint
          </button>
          <button
            disabled={!isOwner(token, accountAddress)}
            className={classNames('transfer-tab__actions__btn', { 'transfer-tab__actions__btn--active': actionType === 'burn' })}
            onClick={() => this.handleMintOrBurn('burn')}
          >
          Burn
          </button>
        </div>
        <div className='transfer-tab__content__amount'>
          <span className='transfer-tab__content__amount__text'>Amount</span>
          {
            actionType === 'mint'
              ? (
                <Fragment>
                  <Field
                    onFocus={() => setFieldTouched('mintAmount', true)}
                    className='transfer-tab__content__amount__field'
                    name='mintAmount'
                    placeholder='...'
                  />
                  { actionType === 'mint' && errors && errors.mintAmount && <span className='input-error'>{errors.mintAmount}</span> }
                </Fragment>
              ) : (
                <Fragment>
                  <Field
                    onFocus={() => setFieldTouched('burnAmount', true)}
                    className='transfer-tab__content__amount__field'
                    name='burnAmount'
                    placeholder='...'
                  />
                  { actionType === 'burn' && errors && errors.burnAmount && <span className='input-error'>{errors.burnAmount}</span> }
                </Fragment>
              )
          }
        </div>
        <div className='transfer-tab__content__button'>
          {
            actionType && <TransactionButton type='submit' frontText={upperCase(actionType)} />
          }
        </div>
      </form>
    )
  }

  render = () => (
    <Formik
      initialValues={this.initialValues}
      validationSchema={this.validationSchema}
      render={this.renderForm}
      onSubmit={this.onSubmit}
    />
  )
}
