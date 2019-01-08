import {createRequestTypes, action} from './utils'

export const BALANCE_OF = createRequestTypes('BALANCE_OF')
export const BALANCE_OF_CLN = createRequestTypes('BALANCE_OF_CLN')
export const FETCH_TOKENS = createRequestTypes('FETCH_TOKENS')
export const FETCH_BALANCES = createRequestTypes('FETCH_BALANCES')
export const FETCH_TOKENS_WITH_BALANCES = createRequestTypes('FETCH_TOKENS_WITH_BALANCES')
export const SET_USER_INFORMATION = createRequestTypes('SET_USER_INFORMATION')

export const balanceOf = (tokenAddress, accountAddress) => action(BALANCE_OF.REQUEST, {tokenAddress, accountAddress})
export const balanceOfCln = (accountAddress) => action(BALANCE_OF_CLN.REQUEST, {accountAddress})

export const fetchTokens = (accountAddress) => action(FETCH_TOKENS.REQUEST, {accountAddress})
export const fetchBalances = (tokens, accountAddress) => action(FETCH_BALANCES.REQUEST, {accountAddress, tokens})
export const setUserInformation = (information) => action(SET_USER_INFORMATION.REQUEST, {information})
