import { createStore, applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'
import createSagaMiddleware, { END } from 'redux-saga'
import createHistory from 'history/createBrowserHistory'
import { routerMiddleware } from 'react-router-redux'

import rootReducer from '../reducers'

const history = createHistory()

export default function configureStore (initialState) {
  const sagaMiddleware = createSagaMiddleware()
  const routerMd = routerMiddleware(history)
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(
      applyMiddleware(
        routerMd,
        sagaMiddleware,
        createLogger({
          collapsed: (getState, action, logEntry) => !action.error,
          actionTransformer: (action) => {
            if (action.error) {
              console.error(action.error)
            }
            return action
          }
        })
      )
    )
  )

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default
      store.replaceReducer(nextRootReducer)
    })
  }
  store.runSaga = sagaMiddleware.run
  store.close = () => store.dispatch(END)
  return store
}
