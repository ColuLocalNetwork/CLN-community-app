import {GET_LIST, FETCH_ENTITIES} from 'actions/list'

export default (state = {}, action) => {
  switch (action.type) {
    case GET_LIST.SUCCESS:
      return {...state, ...action.response}
    case FETCH_ENTITIES.SUCCESS:
      return {...state, ...action.response}
    default:
      return state
  }
}
