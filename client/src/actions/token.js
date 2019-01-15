import {action, createTransactionRequestTypes} from './utils'

export const CREATE_TOKEN = createTransactionRequestTypes('CREATE_TOKEN')

export const createToken = (tokenData) => action(CREATE_TOKEN.REQUEST, tokenData)
