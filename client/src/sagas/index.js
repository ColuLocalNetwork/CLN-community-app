import { all, fork } from 'redux-saga/effects'

import communitiesSaga from './communities'
import networkSaga from './network'
import metadataSaga from './metadata'
import accountsSaga from './accounts'
import issuanceSaga from './issuance'
import directorySaga from './directory'
import tokenSaga from './token'

export default function * rootSaga () {
  yield all([
    fork(communitiesSaga),
    fork(metadataSaga),
    fork(networkSaga),
    fork(accountsSaga),
    fork(issuanceSaga),
    fork(directorySaga),
    fork(tokenSaga)
  ])
}
