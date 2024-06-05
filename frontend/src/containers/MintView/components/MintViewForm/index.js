import React, { useState } from 'react'
import TextInput from 'components/TextInput'
import Button from 'components/Button'
import LabeledText from 'components/LabeledText'
import NumberFormatter from 'components/NumberFormatter'
import commaNumber from 'comma-number'
import { isAddress } from 'ethers'
import { styles } from './styles.scss'

function MintViewForm(props) {
    const [toAddress, setToAddress] = useState('')
    const [amount, setAmount] = useState('')
    const [toAddressError, setToAddressError] = useState(false)
    const [toAddressErrorTxt, setToAddressErrorTxt] = useState('')

    const onFormSubmit = async (e) => {
      const { onSubmit } = props
      
      if(isAddress(toAddress)) {
        onSubmit(toAddress, amount)
        setToAddress('')
        setAmount('')
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
        <ul id="token-info">
          <li>
            <LabeledText label="Token Name:" />
            <span>
              <strong>{props.tokenName}</strong>
              </span>
          </li>
          <li>
            <LabeledText label="Current token supply:" />
            <span><strong>{commaNumber(props.totalSupply)}</strong></span>
          </li>
          <li>
            <LabeledText label="Hard-capped token supply:" />
            <span><strong>{commaNumber(props.cappedTokenSupply)}</strong></span>
          </li>
        </ul>
        <form onSubmit={onFormSubmit}>
          <div className="section">
            <LabeledText label="Enter Ethereum address to credit:" />
            <TextInput 
              placeholder="0x"
              value={toAddress}
              onChange={e => setToAddress(e.currentTarget.value)}
              required
              error={toAddressError}
              helperText={toAddressErrorTxt}
              className="text-input"
              variant="outlined"
            />
          </div>
          <div className="section">
            <LabeledText label="Enter amount of tokens to credit:" />
            <TextInput
              placeholder="Enter number of tokens to credit"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required  
              name="mint-view-form-amount-input"
              className="text-input"
              InputProps={{
                inputComponent: NumberFormatter
              }}
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
              Mint Tokens
            </Button>
          </div>
        </form>
      </div>
    )
}
export default MintViewForm
