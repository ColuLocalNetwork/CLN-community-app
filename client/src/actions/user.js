import {createRequestTypes, requestAction} from './utils'

export const LOGIN = createRequestTypes('LOGIN')
export const LOGOUT = createRequestTypes('LOGOUT')
export const ADD_USER_INFORMATION = createRequestTypes('ADD_USER_INFORMATION')

export const login = () => requestAction(LOGIN)
export const logout = () => requestAction(LOGOUT)
export const addUserInformation = (user) => requestAction(ADD_USER_INFORMATION, {user})
