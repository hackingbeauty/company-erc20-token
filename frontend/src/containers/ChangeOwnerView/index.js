import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as transactionActionCreators  from 'core/actions/actions-transaction'
import ChangeOwnerForm from './components/ChangeOwnerForm'
import { styles } from './styles.scss'

class ChangeOwnerView extends Component {
  changeContractOwner = (newOwner) => {
    const { actions, provider } = this.props
    const { metaMaskAccount } = provider
    const showLoader = (metaMaskAccount && metaMaskAccount.length) ? true : false
    actions.transaction.changeContractOwner(newOwner, showLoader)
  }
  render() {
    const { provider, transaction } = this.props
    const { transactionSucceeded } = transaction
    const { tokenContractOwner } = provider

    return (
      <div className={styles}>
        <div className="container">
          <ChangeOwnerForm
            onSubmit={this.changeContractOwner}
            transactionSucceeded={transactionSucceeded}
            currentOwner={tokenContractOwner}
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

export default connect(mapStateToProps, mapDispatchToProps)(ChangeOwnerView)
