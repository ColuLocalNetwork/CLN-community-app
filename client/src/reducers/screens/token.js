import { TRANSFER_TOKEN } from 'actions/token'

export default (state = {}, action) => {
  switch (action.type) {
    case TRANSFER_TOKEN.SUCCESS:
      return {...state, ...action.response}
    default:
      return state
  }
}
