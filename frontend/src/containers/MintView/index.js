import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as transactionActionCreators  from 'core/actions/actions-transaction'
import MintViewForm from './components/MintViewForm'
import { styles } from './styles.scss'

class MintView extends Component {
  mintTokens = (toAddress, amount) => {
    const { actions, provider } = this.props
    const { metaMaskAccount } = provider
    const showLoader = (metaMaskAccount && metaMaskAccount.length) ? true : false
    actions.transaction.mintTokens(toAddress, amount, showLoader)
  }

  render() {
    const { provider, transaction } = this.props
    const { transactionSucceeded } = transaction
    const { 
      tokenName,
      totalSupply,
      cappedTokenSupply 
    } = provider

    return (
      <div className={styles}>
        <div className="container">
          <MintViewForm
            tokenName={tokenName}
            totalSupply={totalSupply}
            cappedTokenSupply={cappedTokenSupply}
            transactionSucceeded={transactionSucceeded}
            onSubmit={this.mintTokens}
          />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    provider: state.provider,
    transaction: state.transaction
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      transaction: bindActionCreators(transactionActionCreators, dispatch)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MintView)