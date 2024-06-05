import constants from 'core/types'
import { takeEvery, call, put } from 'redux-saga/effects'
import { BrowserProvider, Contract, formatUnits }  from 'ethers'
import { getContractAddressFromChainId } from 'core/libs/lib-rpc-helpers'
import CompanyERC20TokenABI from "../../../../artifacts/contracts/CompanyERC20Token.sol/CompanyERC20Token.json"

export function* setProvider() {
  try {
    const isMetaMaskUnLocked = yield call([window.ethereum._metamask,'isUnlocked'])
    
    /* Only set the provider if MetaMask is unlocked */
    if(isMetaMaskUnLocked) {
      const web3Provider= new BrowserProvider(window.ethereum)
      const accounts= yield call(window.ethereum.request, {method: 'eth_accounts', "params": []})     
      const metaMaskAccount= accounts[0]
      const chainId= yield call(window.ethereum.request, { method: "eth_chainId" })    
      const signer= yield call([web3Provider,'getSigner'])
      const contractAddress = getContractAddressFromChainId(parseInt(chainId, 16))
      
      console.log('--- chain ID: ', parseInt(chainId, 16))
      console.log('--- deployed contract address used is: ', contractAddress)

      const contract = new Contract(
        contractAddress,
        CompanyERC20TokenABI.abi,
        web3Provider
      )
  
      const tokenName = yield call([contract,'name'])
      const tokenSymbol = yield call([contract,'symbol'])
      const totalSupply = formatUnits(yield call([contract,'totalSupply']), 18)
      const tokenContractOwner = yield call([contract,'owner'])
      const cappedTokenSupply = formatUnits(yield call([contract,'cap']), 18)
      
      yield put({ type: constants.CLOSE_RIGHT_DRAWER })
  
      yield put({
        type: constants.SET_PROVIDER,
        payload: { 
          web3Provider,
          metaMaskAccount,
          signer,
          chainId,
          tokenName,
          tokenSymbol,
          totalSupply,
          tokenContractOwner,
          cappedTokenSupply
        }
      })
    }
  } catch (error) {
    console.log(error)
  }
}

export function* setChainId(action) {
  const { chainId } = action

  try {
    let chainId_

    if(chainId) {
      chainId_ = chainId
    } else {
      chainId_ = yield call(window.ethereum.request, { method: "eth_chainId" })    
    }
  
    yield put({
      type: constants.SET_CHAIN_ID,
      payload: { 
        chainId: parseInt(chainId_, 16)
      }
    })
  } catch (error) {
    console.log(error)
  }
}

export function* connectMetaMask() {
  if(window && window.ethereum) {
    const metaMaskConnection = yield call(window.ethereum.request, {
      "method": "eth_requestAccounts",
      "params": []
    })
    const metaMaskAccount = metaMaskConnection[0] 
  
    try {
      yield put({
        type: constants.SET_METAMASK_CONNECTION,
        payload: { metaMaskAccount }
      })
      yield put({ type: constants.CLOSE_RIGHT_DRAWER })
    } catch (error) {
      console.log(error)
    }
  } else {
    yield put({ 
      type: constants.DISPLAY_METAMASK_INSTALL_PROMPT,
      payload: { modalKey: 'install-metamask-prompt' }
    })
  }
}

export function* watchProviderActions() {
  yield takeEvery(constants.INIT_PROVIDER, setProvider),
  yield takeEvery(constants.INIT_CHAIN_ID, setChainId)
  yield takeEvery(constants.CONNECT_METAMASK, connectMetaMask)
}
