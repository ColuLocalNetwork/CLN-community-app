import * as actions from 'actions/bridge'
import {LOCATION_CHANGE} from 'connected-react-router'

const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.WATCH_FOREIGN_BRIDGE.SUCCESS:
      return {...state, ...action.response}
    case actions.WATCH_HOME_BRIDGE.SUCCESS:
      return {...state, ...action.response}
    case actions.DEPLOY_BRIDGE.REQUEST:
      return {...state, bridgeDeploying: true}
    case actions.DEPLOY_BRIDGE.SUCCESS:
      return {...state, bridgeDeploying: false}
    case actions.TRANSFER_TO_HOME.PENDING:
      return {...state, ...action.response}
    case actions.TRANSFER_TO_FOREIGN.PENDING:
      return {...state, ...action.response}
    case actions.TRANSFER_TO_HOME.REQUEST:
      return {...state, confirmationsLimit: action.confirmationsLimit}
    case actions.TRANSFER_TO_FOREIGN.REQUEST:
      return {...state, confirmationsLimit: action.confirmationsLimit}
    case LOCATION_CHANGE:
      return initialState
    default:
      return state
  }
}
