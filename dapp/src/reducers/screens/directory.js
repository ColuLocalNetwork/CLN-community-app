import union from 'lodash/union'
import {
  CREATE_LIST,
  ADD_ENTITY,
  EDIT_ENTITY,
  FETCH_COMMUNITY,
  FETCH_USERS_ENTITIES,
  FETCH_BUSINESSES_ENTITIES
} from 'actions/directory'
import { REQUEST, SUCCESS } from 'actions/constants'
import { LOCATION_CHANGE } from 'connected-react-router'

const initialState = {
  usersResults: [],
  merchantsResults: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE_LIST.REQUEST:
      return { ...state, transactionStatus: REQUEST }
    case CREATE_LIST.SUCCESS:
      return { ...state, ...action.response, transactionStatus: SUCCESS }
    case ADD_ENTITY.REQUEST:
      return { ...state, signatureNeeded: true }
    case ADD_ENTITY.PENDING:
      return { ...state, transactionHash: action.response.transactionHash, signatureNeeded: false }
    case EDIT_ENTITY.PENDING:
      return { ...state, editTransactionHash: action.response.transactionHash }
    case FETCH_COMMUNITY.SUCCESS:
      return { ...state, ...action.response }
    case FETCH_USERS_ENTITIES.SUCCESS:
      return { ...state, usersResults: union(state.usersResults, action.response.result) }
    case FETCH_BUSINESSES_ENTITIES.SUCCESS:
      return { ...state, merchantsResults: union(state.merchantsResults, action.response.result) }
    case LOCATION_CHANGE:
      if (action.payload.location.pathname === '/') {
        return initialState
      } else {
        return state
      }
    default:
      return state
  }
}
