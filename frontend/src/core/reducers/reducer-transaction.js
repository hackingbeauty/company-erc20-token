import constants from 'core/types'

const initialState = {
  transactionStatus: null,
  transactionProcessingMsg: '',
  showLoader: false
}

export function transactionReducer(state = initialState, action) {
  switch (action.type) {
    
    default:
      return state
  }
}

export default transactionReducer

