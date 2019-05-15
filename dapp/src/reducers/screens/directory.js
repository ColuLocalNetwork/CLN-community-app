import union from 'lodash/union'
import {
  CREATE_LIST,
  ADD_ENTITY,
  EDIT_ENTITY,
  FETCH_COMMUNITY,
  FETCH_USERS_ENTITIES,
  FETCH_BUSINESSES_ENTITIES,
  REMOVE_ENTITY,
  MAKE_ADMIN,
  REMOVE_AS_ADMIN
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
    case MAKE_ADMIN.REQUEST:
      return { ...state, transactionStatus: REQUEST, signatureNeeded: true }
    case MAKE_ADMIN.PENDING:
      return { ...state, transactionHash: action.response.transactionHash, signatureNeeded: false }
    case MAKE_ADMIN.SUCCESS:
      return { ...state, ...action.response }
    case REMOVE_AS_ADMIN.REQUEST:
      return { ...state, transactionStatus: REQUEST }
    case REMOVE_AS_ADMIN.PENDING:
      return { ...state, transactionHash: action.response.transactionHash, signatureNeeded: false }
    case REMOVE_AS_ADMIN.SUCCESS:
      return { ...state, ...action.response }
    case REMOVE_ENTITY.REQUEST:
      return { ...state, transactionStatus: REQUEST }
    case REMOVE_ENTITY.PENDING:
      return { ...state, transactionHash: action.response.transactionHash, signatureNeeded: false }
    case REMOVE_ENTITY.SUCCESS:
      const { receipt: { events: { EntityRemoved: { returnValues: { account } } } } } = action.response
      return {
        ...state,
        ...action.response,
        merchantsResults: state.merchantsResults.filter(val => val !== account),
        usersResults: state.usersResults.filter(val => val !== account)
      }
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
