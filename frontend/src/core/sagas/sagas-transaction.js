import constants from 'core/types'
import { takeEvery, select, put, call } from 'redux-saga/effects'
import { parseUnits, Contract, formatUnits } from 'ethers'
import { getContractAddressFromChainId } from 'core/libs/lib-rpc-helpers'
import CompanyERC20TokenABI from "../../../../artifacts/contracts/CompanyERC20Token.sol/CompanyERC20Token.json"
export function* mintTokens(action) {
  const { metaMaskAccount } = yield select(state => state.provider)
  const { toAddress, amount } = action

  if(window.ethereum) {
    /* If user is logged into MetaMask, execute tx (transaction).
        Otherwise, prompt user to install MetaMask
    */
    if(metaMaskAccount && metaMaskAccount.length) {
      const { signer, chainId } =  yield select(state => state.provider)
      const contractAddress = getContractAddressFromChainId(chainId)
      
      // Connected to a Signer; can make state changing transactions,
      // which will cost the account ether.
      const contract = new Contract(
        contractAddress,
        CompanyERC20TokenABI.abi,
        signer
      )

      yield put({
        type: constants.MINT_TOKENS_MSG,
        payload: { 
          transactionProcessingMsg: `Minting ${amount} tokens for account ${toAddress}`
        }
      })

      try {
        // Send the transaction
        const tx= yield call([contract,'mint'], toAddress, parseUnits(amount, 18))
        const txReceipt = yield call([tx,'wait'])
        console.log('---- mint tokens receipt is: ----', txReceipt)
        const transactionStatus = `${amount} tokens credited to ${toAddress}`
        const updatedTotalSupply = formatUnits(yield call([contract,'totalSupply']), 18)

        yield put({
          type: constants.MINT_TOKENS_TX,
          payload: { 
            transactionStatus,
            showLoader: false,
            txReceipt
          }
        })

        yield put({
          type: constants.UPDATE_TOKEN_INFO,
          payload: { totalSupply: updatedTotalSupply }
        })
      } catch(e) {
        const errorToStr = JSON.stringify(e)
        const errorObj = JSON.parse(errorToStr)
        let message

        if('info.error.data' in errorObj) {
          message= errorObj.info.error.data
        } else {
          message = errorObj.shortMessage
        }

        const transactionStatus = `Transaction Failed: ${message}`

        yield put({
          type: constants.MINT_TOKENS_TX,
          payload: { 
            transactionStatus,
            showLoader: false
          }
        })
      }
    } else {
      yield put({ 
        type: constants.OPEN_RIGHT_DRAWER
      })
    }
  } else {
    yield put({
      type: constants.DISPLAY_METAMASK_INSTALL_PROMPT,
      payload: { modalKey: 'install-metamask-prompt' }
    })
  }
}

export function* changeContractOwner(action) {
  const { metaMaskAccount } = yield select(state => state.provider)
  const { newOwner } = action
  
  if(window.ethereum) {
    /* If user is logged into MetaMask, execute tx (transaction).
        Otherwise, prompt user to install MetaMask
    */
    if(metaMaskAccount && metaMaskAccount.length) {
      const { signer, chainId } =  yield select(state => state.provider)
      const contractAddress = getContractAddressFromChainId(chainId)

      // Connected to a Signer; can make state changing transactions,
      // which will cost the account ether
      const contract = new Contract(
        contractAddress,
        CompanyERC20TokenABI.abi,
        signer
      )

      yield put({
        type: constants.CHANGE_CONTRACT_OWNER_MSG,
        payload: { 
          transactionProcessingMsg: `Changing owner to account: ${newOwner}`
        }
      })

      try {
        // Execute transcaction
        const tx= yield call([contract,'transferOwnership'], newOwner)
        const txReceipt = yield call([tx,'wait'])
        console.log('---- change owner receipt yields: ', txReceipt)
        const transactionStatus = `Contract owner changed to: ${newOwner}`

        yield put({
          type: constants.CHANGE_CONTRACT_OWNER_TX,
          payload: { 
            transactionStatus,
            showLoader: false
          }
        })
        yield put({
          type: constants.UPDATE_OWNER_INFO,
          payload: { tokenContractOwner: newOwner }
        })
      } catch(e) {
        const errorToStr = JSON.stringify(e)
        const errorObj = JSON.parse(errorToStr)
        let message

        if('info.error.data' in errorObj) {
          message= errorObj.info.error.data
        } else {
          message = errorObj.shortMessage
        }

        const transactionStatus = `Transaction Failed: ${message}`
  
        yield put({
          type: constants.CHANGE_CONTRACT_OWNER_TX,
          payload: { 
            transactionStatus,
            showLoader: false
          }
        })
      }
    } else {
      yield put({ 
        type: constants.OPEN_RIGHT_DRAWER
      })
    }
  } else {    
    yield put({
      type: constants.DISPLAY_METAMASK_INSTALL_PROMPT,
      payload: { modalKey: 'install-metamask-prompt' }
    })
  }
}

export function* watchTransactionActions() {
  yield takeEvery(constants.MINT_TOKENS, mintTokens)
  yield takeEvery(constants.CHANGE_CONTRACT_OWNER, changeContractOwner)
}
