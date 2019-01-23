import {createRequestTypes, action} from './utils'

export const BALANCE_OF_TOKEN = createRequestTypes('BALANCE_OF_TOKEN')
export const BALANCE_OF_NATIVE = createRequestTypes('BALANCE_OF_NATIVE')
export const BALANCE_OF_CLN = createRequestTypes('BALANCE_OF_CLN')

export const FETCH_TOKENS_BY_ACCOUNT = createRequestTypes('FETCH_TOKENS_BY_ACCOUNT')
export const FETCH_BALANCES = createRequestTypes('FETCH_BALANCES')
export const FETCH_TOKENS_WITH_BALANCES = createRequestTypes('FETCH_TOKENS_WITH_BALANCES')
export const SET_USER_INFORMATION = createRequestTypes('SET_USER_INFORMATION')

export const balanceOfToken = (tokenAddress, accountAddress) => action(BALANCE_OF_TOKEN.REQUEST, {tokenAddress, accountAddress})
export const balanceOfNative = (accountAddress) => action(BALANCE_OF_NATIVE.REQUEST, {accountAddress})
export const balanceOfCln = (accountAddress) => action(BALANCE_OF_CLN.REQUEST, {accountAddress})

export const fetchTokensByAccount = (accountAddress) => action(FETCH_TOKENS_BY_ACCOUNT.REQUEST, {accountAddress})
export const fetchBalances = (tokens, accountAddress) => action(FETCH_BALANCES.REQUEST, {accountAddress, tokens})
export const fetchTokensWithBalances = (accountAddress) => action(FETCH_TOKENS_WITH_BALANCES.REQUEST, {accountAddress})

export const setUserInformation = (user) => action(SET_USER_INFORMATION.REQUEST, {user})
