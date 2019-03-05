import {FETCH_HOME_TOKEN, FETCH_HOME_BRIDGE, FETCH_FOREIGN_BRIDGE, DEPLOY_BRIDGE} from 'actions/bridge'
import {LOCATION_CHANGE} from 'connected-react-router'

const initialState = {}
export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_HOME_TOKEN.SUCCESS:
      return {...state, ...action.response}
    case FETCH_HOME_BRIDGE.SUCCESS:
      return {...state, ...action.response}
    case FETCH_FOREIGN_BRIDGE.SUCCESS:
      return {...state, ...action.response}
    case DEPLOY_BRIDGE.SUCCESS:
      return {...state, ...action.response, bridgeDeploying: false}
    case DEPLOY_BRIDGE.REQUEST:
      return {...state, bridgeDeploying: true}
    case LOCATION_CHANGE:
      return initialState
    default:
      return state
  }
}
