import React from 'react'
import PropTypes from 'prop-types'
import GenericModal from 'components/dashboard/GenericModal'

class NoDataAboutOwnerModal extends React.Component {
  handleClose = () => {
    this.props.hideModal()
    if (this.props.handleClose) {
      this.props.handleClose()
    }
  }

  handleButton = () => {
    this.handleClose()
  }

  render () {
    const content = {
      title: 'Owner choose to stay anonymous and not provide us its details',
    //   body: isOwner ? 'So you have a community currency and you connected it to the Fuse chain. Now it is the time to create a community! The first step is to deploy a list of businesses that can recieve your community currency in exchange of goods and services. The business list is managed via a smart contract to provide transaparency and business logic for the payments. This list will allow community members to know to what businesses they can use their tokens within the community wallet!' : 'The first step to become a community is to have a list of businesses that can recieve this community currency in exchange of goods and services. The business list is managed via a smart contract to provide transaparency and business logic for the payments. This list will allow community members to know to what businesses they can use their tokens within the community wallet!',
      buttonText: 'Got it'
    }
    return (
      <GenericModal
        hideModal={this.handleClose}
        content={content}
        buttonAction={this.handleButton}
      />
    )
  }
}

NoDataAboutOwnerModal.propTypes = {
}

export default NoDataAboutOwnerModal
