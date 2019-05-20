import React from 'react'
import Modal from 'components/Modal'
import QRCode from 'qrcode.react'

export default ({ value, hideModal }) => {
  return (
    <Modal className='qr-code__wrapper' onClose={hideModal}>
      <div className='qr-code'>
        <h6 className='qr-code__title'>{value}</h6>
        <div className='qr-code__image'>
          <QRCode size={250} value={value} />
        </div>
      </div>
    </Modal>
  )
}
