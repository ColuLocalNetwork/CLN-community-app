import {CHANGE} from 'actions/marketMaker'
import * as actions from 'actions/accounts'

const initialAccount = {
  balances: {},
  transactions: {
  }
}

const handlers = {
  [CHANGE.PENDING]: (state, action) => {
    const transactionHash = action.response.transactionHash
    const transactions = {...state.transactions,
      [transactionHash]: {
        isPending: true,
        transactionHash
      }}
    return {...state, transactions}
  },
  [CHANGE.SUCCESS]: (state, action) => {
    const receipt = action.response.receipt
    const transactionHash = receipt.transactionHash
    const transactions = {...state.transactions,
      [transactionHash]: {
        isPending: false,
        ...receipt
      }
    }
    return {...state, transactions}
  },
  [CHANGE.FAILURE]: (state, action) => {
    if (!action.response) {
      return state
    }
    const receipt = action.response.receipt
    const transactionHash = receipt.transactionHash
    const transactions = {...state.transactions,
      [transactionHash]: {
        isPending: false,
        isFailed: true,
        ...receipt
      }
    }
    return {...state, transactions}
  },
  [actions.BALANCE_OF.SUCCESS]: (state, action) => {
    const balances = {...state.balances, [action.tokenAddress]: action.response.balanceOf}
    return {...state, balances}
  }
}

export default (state = {}, action) => {
  if (handlers.hasOwnProperty(action.type) && action.accountAddress) {
    const account = state[action.accountAddress] || initialAccount
    return {...state, [action.accountAddress]: handlers[action.type](account, action)}
  }
  return state
}
