import {FETCH_TOKEN_STATISTICS} from 'actions/token'
import {ADD_USER_INFORMATION} from 'actions/accounts'

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_TOKEN_STATISTICS.SUCCESS:
      return {...state, ...action.response}
    case ADD_USER_INFORMATION.SUCCESS:
      return {...state, informationAdded: true}
    default:
      return state
  }
}
