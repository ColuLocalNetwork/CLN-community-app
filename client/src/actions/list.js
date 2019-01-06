import {action, createTransactionRequestTypes} from './utils'

export const CREATE_LIST = createTransactionRequestTypes('CREATE_LIST')
export const ADD_ENTITY = createTransactionRequestTypes('ADD_ENTITY')
export const REMOVE_ENTITY = createTransactionRequestTypes('REMOVE_ENTITY')
export const FETCH_ENTITIES = createTransactionRequestTypes('FETCH_ENTITIES')

export const createList = (tokenAddress) => action(CREATE_LIST.REQUEST, {tokenAddress})
export const addEntity = (data) => action(ADD_ENTITY.REQUEST, {data})
export const removeEntity = (hash) => action(REMOVE_ENTITY.REQUEST, {hash})
export const fetchEntities = (page) => action(FETCH_ENTITIES.REQUEST, {page})
