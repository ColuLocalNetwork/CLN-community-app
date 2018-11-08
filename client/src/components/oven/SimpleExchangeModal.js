import React, {Component} from 'react'
import Modal from 'components/Modal'

class SimpleExchangeModal extends Component {
  render = () => (
    <Modal onClose={this.props.hideModal}>Hey</Modal>
  )
}

export default SimpleExchangeModal
