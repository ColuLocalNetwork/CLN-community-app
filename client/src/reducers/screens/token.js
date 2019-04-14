import { TRANSFER_TOKEN, MINT_TOKEN, BURN_TOKEN } from 'actions/token'
import { REQUEST, SUCCESS, FAILURE, PENDING, CONFIRMATION } from 'actions/constants'

const initialState = {
  transferTokenStatus: null,
  mintBurnStatus: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case TRANSFER_TOKEN.REQUEST:
      return { ...state, transferTokenStatus: REQUEST, transferTokenInProgress: true }
    case TRANSFER_TOKEN.CONFIRMATION:
      return { ...state, ...action.response }
    case TRANSFER_TOKEN.PENDING:
      return { ...state, transferTokenStatus: PENDING }
    case TRANSFER_TOKEN.SUCCESS:
      return { ...state, ...action.response, transferTokenInProgress: false }
    case MINT_TOKEN.REQUEST:
      return { ...state, mintBurnStatus: REQUEST, mintBurnToken: true }
    case MINT_TOKEN.CONFIRMATION:
      return { ...state, ...action.response }
    case MINT_TOKEN.PENDING:
      return { ...state, mintBurnStatus: PENDING }
    case MINT_TOKEN.SUCCESS:
      return { ...state, ...action.response, mintBurnToken: false }
    case BURN_TOKEN.REQUEST:
      return { ...state, mintBurnStatus: REQUEST, mintBurnToken: true }
    case BURN_TOKEN.CONFIRMATION:
      return { ...state, ...action.response }
    case BURN_TOKEN.PENDING:
      return { ...state, mintBurnStatus: PENDING }
    case BURN_TOKEN.SUCCESS:
      return { ...state, ...action.response, mintBurnToken: false }
    default:
      return state
  }
}
