import {GET_LIST, FETCH_ENTITIES} from 'actions/directory'

const initialState = {
  listHashes: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_LIST.SUCCESS:
      return {...state, ...action.response}
    case FETCH_ENTITIES.SUCCESS:
      return {...state, ...action.response}
    default:
      return state
  }
}
