import React from 'react'
import { getNetworkNameFromId } from 'core/libs/lib-rpc-helpers'
import { styles } from './styles.scss'

const ChainId = (props) => {
  const { id } = props

  return (
    <div className={styles}>
      <span>Current chain: {getNetworkNameFromId(id)}</span>
    </div>
  )
}

export default ChainId
