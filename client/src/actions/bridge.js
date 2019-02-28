import {createRequestTypes, requestAction} from './utils'

export const FETCH_BRIDGE = createRequestTypes('FETCH_BRIDGE')
export const FETCH_HOME_TOKEN = createRequestTypes('FETCH_HOME_TOKEN')

export const fetchBridge = (tokenAddress) => requestAction(FETCH_BRIDGE, {tokenAddress})
export const fetchHomeToken = (foreignTokenAddress) => requestAction(FETCH_HOME_TOKEN, {foreignTokenAddress})
