import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Modal from 'components/Modal'
import {formatWei} from 'utils/format'
import CommunityLogo from 'components/common/CommunityLogo'

class SimpleExchangeModal extends Component {
  render = () => (
    <Modal className='exchange-modal' onClose={this.props.hideModal}>
      <div className='exchange-modal-up'>
        <div className='coin-wrapper'>
          <CommunityLogo token={this.props.token} />
        </div>
        <div>Total Supply: {formatWei(this.props.token.totalSupply, 0)}</div>
        <div>CLN reserve: {formatWei(this.props.marketMaker.clnReserve, 0)}</div>
      </div>
      <div className='exchange-modal-down'>
        <div className='exchange-modal-middle'>
          <button className='btn-exchange'>Exchange</button>
        </div>
      </div>
    </Modal>
  )
}

SimpleExchangeModal.propTypes = {
  token: PropTypes.object.isRequired,
  marketMaker: PropTypes.object.isRequired
}

export default SimpleExchangeModal
