import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { Route } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import { AnimatedRoute } from 'react-router-transition'
import App from 'containers/App'
import IssuanceWizard from 'components/issuance/IssuanceWizard'
import ContactForm from 'components/ContactForm'
import withTracker from 'containers/withTracker'
import {withMaybe} from 'utils/components'
import Web3 from 'containers/Web3'

const history = createHistory()

const withNetwork = (Component) => {

  // const 
  // return connect(mapStateToProps, mapDispatchToProps)(Web3)
  return (props) =>
    state.networkType
      ? <Component {...props} />
      : null
}

const contactFormTransition = {
  atEnter: {
    offset: 100,
    opacity: 0
  },
  atLeave: {
    offset: 100,
    opacity: 0
  },
  atActive: {
    offset: 0,
    opacity: 1
  }
}

function mapStylesContact (styles) {
  return {
    transform: `translateY(${styles.offset}%)`,
    opacity: `${styles.opacity}`
  }
}

export default class Root extends Component {
  render () {
    const { store } = this.props
    debugger
    const state = store.getState()
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <div>
            <Web3 />
            <div style={{height: '100%'}}>
              <Route path='/' component={withTracker(withNetwork(App, state))} />
              <div className='contact-form-wrapper'>
                <AnimatedRoute
                  path='/view/contact-us'
                  component={withTracker(ContactForm)}
                  mapStyles={mapStylesContact}
                  {...contactFormTransition}
                />
              </div>
              <Route
                path='/view/issuance'
                component={withTracker(IssuanceWizard)}
                mapStyles={mapStylesContact}
                {...contactFormTransition}
              />
            </div>
          </div>
        </ConnectedRouter>
      </Provider>)
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired
}
