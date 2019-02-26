import {createRequestTypes, requestAction} from './utils'

export const FETCH_BRIDGE = createRequestTypes('FETCH_BRIDGE')

export const fetchBridge = (tokenAddress) => requestAction(FETCH_BRIDGE, {tokenAddress})
