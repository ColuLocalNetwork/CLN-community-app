import {FETCH_HOME_TOKEN, FETCH_HOME_BRIDGE, FETCH_FOREIGN_BRIDGE} from 'actions/bridge'

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_HOME_TOKEN.SUCCESS:
      return {...state, ...action.response}
    case FETCH_HOME_BRIDGE.SUCCESS:
      return {...state, ...action.response}
    case FETCH_FOREIGN_BRIDGE.SUCCESS:
      return {...state, ...action.response}
    default:
      return state
  }
}
