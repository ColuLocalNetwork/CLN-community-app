import React from 'react'
import PropTypes from 'prop-types'
import Loader from 'components/Loader'

const CommunityLogo = (props) => {
  const communityLogo = props.metadata.communityLogo ? props.metadata.communityLogo.split('.')[0] : null
  return (
    <div className='coin-logo'>
      {
        props.metadata.communityLogo
          ? <div className={`logo-img ${communityLogo}`} />
          : <Loader color='#fff' className='logo-img' />
      }
      <span className='symbol-text'>{props.token.symbol}</span>
    </div>
  )
}

CommunityLogo.propTypes = {
  token: PropTypes.object.isRequired,
  metadata: PropTypes.object
}

export default CommunityLogo
