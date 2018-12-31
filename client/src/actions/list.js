import {action, createTransactionRequestTypes} from './utils'

export const CREATE_LIST = createTransactionRequestTypes('CREATE_LIST')

export const createList = () => action(CREATE_LIST.REQUEST, {})
