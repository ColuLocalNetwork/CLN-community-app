import { combineReducers } from 'redux'

import oven from './oven'
import calculator from './calculator'
import issuance from './issuance'
import dashboard from './dashboard'
import directory from './directory'
import bridge from './bridge'

const screensReducer = combineReducers({
  bridge,
  oven,
  calculator,
  issuance,
  dashboard,
  directory
})

export default screensReducer
