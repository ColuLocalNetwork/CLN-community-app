import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { Route } from 'react-router'
import { ConnectedRouter } from 'connected-react-router'
import createHistory from 'history/createBrowserHistory'
import { AnimatedRoute } from 'react-router-transition'
import App from 'containers/App'
import IssuanceWizard from 'components/issuance/IssuanceWizard'
import ContactForm from 'components/ContactForm'
import Dashboard from 'components/Dashboard'
import withTracker from 'containers/withTracker'
import Web3, {withNetwork} from 'containers/Web3'
import Layout from 'components/Layout'
const history = createHistory()

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
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <div>
            <Web3 />
            <div style={{height: '100%'}}>
              <Layout>
                <Route exact path='/' component={withTracker(withNetwork(App))} />
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
                  component={withTracker(withNetwork(IssuanceWizard))}
                  mapStyles={mapStylesContact}
                  {...contactFormTransition}
                />
                <Route
                  path='/view/dashboard/:address'
                  component={withTracker(withNetwork(Dashboard))}
                  mapStyles={mapStylesContact}
                  {...contactFormTransition}
                />
              </Layout>
            </div>
          </div>
        </ConnectedRouter>
      </Provider>)
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired
}
