import { TRANSFER_TOKEN, MINT_TOKEN, BURN_TOKEN } from 'actions/token'
import {FAILURE} from 'actions/constants'

export default (state = {}, action) => {
  switch (action.type) {
    case TRANSFER_TOKEN.REQUEST:
      return { ...state, transferSignature: true }
    case TRANSFER_TOKEN.CONFIRMATION:
      return { ...state, ...action.response }
    case TRANSFER_TOKEN.PENDING:
      return { ...state, transferSignature: false, transactionHash: action.response.transactionHash, isTransfer: true }
    case TRANSFER_TOKEN.SUCCESS:
      return { ...state, ...action.response, transferSignature: false, isTransfer: false }
    case TRANSFER_TOKEN.FAILURE:
      return {...state, ...action.response, transferSignature: false, transactionStatus: FAILURE, transferError: true}
    case MINT_TOKEN.REQUEST:
      return { ...state, mintSignature: true }
    case MINT_TOKEN.CONFIRMATION:
      return { ...state, ...action.response }
    case MINT_TOKEN.PENDING:
      return { ...state, mintSignature: false, transactionHash: action.response.transactionHash, isMinting: true }
    case MINT_TOKEN.SUCCESS:
      return { ...state, ...action.response, isMinting: false }
    case MINT_TOKEN.FAILURE:
      return {...state, ...action.response, mintSignature: false, transactionStatus: FAILURE, burnError: true}
    case BURN_TOKEN.REQUEST:
      return { ...state, burnSignature: true }
    case BURN_TOKEN.CONFIRMATION:
      return { ...state, ...action.response }
    case BURN_TOKEN.PENDING:
      return { ...state, burnSignature: false, transactionHash: action.response.transactionHash, isBurning: true }
    case BURN_TOKEN.SUCCESS:
      return { ...state, ...action.response, isBurning: false }
    case BURN_TOKEN.FAILURE:
      return {...state, ...action.response, transactionStatus: FAILURE, mintError: true, burnSignature: false}
    default:
      return state
  }
}
