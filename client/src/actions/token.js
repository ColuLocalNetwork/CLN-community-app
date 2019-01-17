import {action, createRequestTypes, createEntityAction, createTransactionRequestTypes} from './utils'

export const entityName = 'tokens'
const communityAction = createEntityAction(entityName)

export const FETCH_TOKENS = createRequestTypes('FETCH_TOKENS')
export const FETCH_TOKENS_BY_OWNER = createRequestTypes('FETCH_TOKENS_BY_OWNER')

export const FETCH_CLN_TOKEN = createRequestTypes('FETCH_CLN_TOKEN')

export const CREATE_TOKEN = createTransactionRequestTypes('CREATE_TOKEN')
export const CREATE_TOKEN_WITH_METADATA = createTransactionRequestTypes('CREATE_TOKEN_WITH_METADATA')

export const fetchTokens = (page) => communityAction(FETCH_TOKENS.REQUEST, {page})
export const fetchTokensByOwner = (owner) => communityAction(FETCH_TOKENS_BY_OWNER.REQUEST, {owner})

export const fetchClnToken = () => communityAction(FETCH_CLN_TOKEN.REQUEST)

export const createToken = (tokenData) => action(CREATE_TOKEN.REQUEST, tokenData)
export const createTokenWithMetadata = (tokenData, metadata) => action(CREATE_TOKEN_WITH_METADATA.REQUEST, {tokenData, metadata})
