import {createRequestTypes, action} from './utils'

export const BALANCE_OF = createRequestTypes('BALANCE_OF')
export const BALANCE_OF_CLN = createRequestTypes('BALANCE_OF_CLN')
export const FETCH_TOKENS = createRequestTypes('FETCH_TOKENS')
export const FETCH_MY_BALANCES = createRequestTypes('FETCH_MY_BALANCES')

export const balanceOf = (tokenAddress, accountAddress) => action(BALANCE_OF.REQUEST, {tokenAddress, accountAddress})
export const balanceOfCln = (accountAddress) => action(BALANCE_OF_CLN.REQUEST, {accountAddress})

export const fetchTokens = (accountAddress) => action(FETCH_TOKENS.REQUEST, {accountAddress})
export const fetchMyBalances = (accountAddress) => action(FETCH_MY_BALANCES.REQUEST, {accountAddress})
