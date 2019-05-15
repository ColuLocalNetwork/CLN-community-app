import { action, createEntityAction, createTransactionRequestTypes, createRequestTypes } from './utils'

export const entityName = 'communityEntities'

const businessesAction = createEntityAction('businesses')
const entitiesAction = createEntityAction(entityName)

export const CREATE_LIST = createTransactionRequestTypes('CREATE_LIST')
export const GET_LIST = createTransactionRequestTypes('GET_LIST')

export const FETCH_COMMUNITY = createRequestTypes('GET_COMMUNITY')
export const FETCH_ENTITIES = createRequestTypes('FETCH_ENTITIES')
export const FETCH_USERS_ENTITIES = createRequestTypes('FETCH_USERS_ENTITIES')
export const FETCH_BUSINESSES_ENTITIES = createRequestTypes('FETCH_BUSINESSES_ENTITIES')

export const ADD_ENTITY = createTransactionRequestTypes('ADD_ENTITY')
export const REMOVE_ENTITY = createTransactionRequestTypes('REMOVE_ENTITY')
export const EDIT_ENTITY = createTransactionRequestTypes('EDIT_ENTITY')
export const MAKE_ADMIN = createTransactionRequestTypes('MAKE_ADMIN')
export const REMOVE_AS_ADMIN = createTransactionRequestTypes('REMOVE_AS_ADMIN')
export const CONFIRM_USER = createTransactionRequestTypes('CONFIRM_USER')

// export const ACTIVATE_BUSINESS = createTransactionRequestTypes('ACTIVATE_BUSINESS')
// export const DEACTIVATE_BUSINESS = createTransactionRequestTypes('DEACTIVATE_BUSINESS')

export const FETCH_BUSINESSES = createRequestTypes('FETCH_BUSINESSES')
export const FETCH_BUSINESS = createRequestTypes('FETCH_BUSINESS')

export const FETCH_ENTITY = createRequestTypes('FETCH_ENTITY')

export const createList = (tokenAddress) => action(CREATE_LIST.REQUEST, { tokenAddress })
export const getList = (tokenAddress) => action(GET_LIST.REQUEST, { tokenAddress })

export const fetchCommunity = (tokenAddress) => action(FETCH_COMMUNITY.REQUEST, { tokenAddress })

export const fetchUsersEntities = (communityAddress, entityType = 'user') => entitiesAction(FETCH_USERS_ENTITIES.REQUEST, { communityAddress, entityType })
export const fetchBusinessesEntities = (communityAddress, entityType = 'business') => entitiesAction(FETCH_BUSINESSES_ENTITIES.REQUEST, { communityAddress, entityType })

export const fetchBusinesses = (listAddress, page) => businessesAction(FETCH_BUSINESSES.REQUEST, { listAddress, page })
export const fetchBusiness = (listAddress, hash) => businessesAction(FETCH_BUSINESS.REQUEST, { listAddress, hash })

export const fetchEntity = (account) => entitiesAction(FETCH_ENTITY.REQUEST, { account })

export const addEntity = (communityAddress, data) => action(ADD_ENTITY.REQUEST, { communityAddress, data })
export const removeEntity = (communityAddress, account) => action(REMOVE_ENTITY.REQUEST, { communityAddress, account })
export const makeAdmin = (account) => action(MAKE_ADMIN.REQUEST, { account })
export const removeAsAdmin = (account) => action(REMOVE_AS_ADMIN.REQUEST, { account })
export const confirmUser = (account) => action(CONFIRM_USER.REQUEST, { account })
export const editEntity = (listAddress, hash, data) => action(EDIT_ENTITY.REQUEST, { listAddress, hash, data })

// export const activateBusiness = (listAddress, hash) => action(ACTIVATE_BUSINESS.REQUEST, { listAddress, hash })
// export const deactivateBusiness = (listAddress, hash) => action(DEACTIVATE_BUSINESS.REQUEST, { listAddress, hash })
