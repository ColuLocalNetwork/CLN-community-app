import {createRequestTypes, action} from './utils'

export const LOGIN = createRequestTypes('LOGIN')
export const LOGOUT = createRequestTypes('LOGOUT')

export const login = () => action(LOGIN)
export const logout = () => action(LOGOUT)
