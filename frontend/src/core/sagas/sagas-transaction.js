import constants from 'core/types'
import { takeEvery, select, put, call } from 'redux-saga/effects'
import { parseUnits, Contract, formatUnits } from 'ethers'
import { getContractAddressFromChainId } from 'core/libs/lib-rpc-helpers'

export function* mintTokens(action) {

}

export function* changeContractOwner(action) {

}

export function* watchTransactionActions() {
  yield takeEvery(constants.MINT_TOKENS, mintTokens)
  yield takeEvery(constants.CHANGE_CONTRACT_OWNER, changeContractOwner)
}
