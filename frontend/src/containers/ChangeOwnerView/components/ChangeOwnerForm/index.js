import React, { useState } from 'react'
import TextInput from 'components/TextInput'
import Button from 'components/Button'
import LabeledText from 'components/LabeledText'
import { isAddress } from 'ethers'
import { styles } from './styles.scss'

function ChangeOwnerForm(props) {
    const [newContractOwner, setNewContractOwner] = useState('')
    const [toAddressError, setToAddressError] = useState(false)
    const [toAddressErrorTxt, setToAddressErrorTxt] = useState('')

    const onFormSubmit = async (e) => {
      const { onSubmit } = props

      if(isAddress(newContractOwner)) {
        onSubmit(newContractOwner)
        setNewContractOwner('')
        setToAddressError(false)
        setToAddressErrorTxt('')
      } else {
        setToAddressError(true)
        setToAddressErrorTxt('Please enter a valid Ethereum address')
      }
      e.preventDefault()
    }

    return(
      <div className={styles}>
        <form onSubmit={onFormSubmit}>
          <div className="section">
            <LabeledText label="Current token contract Owner:" />
            <span id="current-owner"><strong>{props.currentOwner}</strong></span>
          </div>
          <div className="section">
            <LabeledText label="Enter new token contract Owner:" />
            <TextInput 
              placeholder="0x" 
              value={newContractOwner}
              onChange={e => setNewContractOwner(e.currentTarget.value)}
              required 
              error={toAddressError}
              helperText={toAddressErrorTxt}
              className="text-input"
              variant="outlined"
            />
          </div>
          <div className="section">
            <Button
              color="primary"
              variant="contained"
              type="submit"
              disableElevation
            >
              Change Owner
            </Button>
          </div>
        </form>
      </div>
    )
}
export default ChangeOwnerForm