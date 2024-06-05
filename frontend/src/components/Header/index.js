import React, { Component } from 'react'
import AppBar from 'components/AppBar'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as uiActionCreators from 'core/actions/actions-ui'
import Button from 'components/Button'
import ChainId from 'components/ChainId'
import Navigation from './components/Navigation'
import {
  Toolbar,
  IconButton
} from '@material-ui/core'
import {
  Menu,
  MenuOpen
} from '@material-ui/icons'
import MetaMaskAccount from './components/MetaMaskAccount'
import { styles } from './styles.scss'

class Header extends Component {

  constructor(props) {
    super(props)

    this.state = {
      anchorEl: null,
      open: false,
      toggleMobileNav: false
    }
  }
  connectWallet = () =>{
    const { actions } = this.props
    actions.ui.openRightDrawer()
  }

  onNavigationChange = () => {
    this.setState({ toggleMobileNav: false })
  }

  toggleMobileNav = () => {
    const { toggleMobileNav } = this.state
    this.setState({ toggleMobileNav: !toggleMobileNav })
  }

  displayMetaMaskAccount = () => {
    const { provider } = this.props
    const { chainId } = provider

    return (
      <div id="right-nav">
        <ChainId id={chainId} />
        <MetaMaskAccount />
      </div>
    )
  }

  displayRightHeaderBtn = () => {
    const { provider } = this.props
    
    return (
      <div id="right-nav">
        <Button
          variant="outlined"
          color="primary"
          onClick={this.connectWallet}
        >
          Connect Wallet
        </Button>
      </div>
    )
  }

  render() {
    const { navLinks, provider} = this.props
    const { metaMaskAccount, chainId } = provider
    const { toggleMobileNav } = this.state
    const menuIcon = toggleMobileNav ? <MenuOpen /> : <Menu />
    let rightBtn
   
    if(provider && metaMaskAccount && metaMaskAccount.length){
      rightBtn = this.displayMetaMaskAccount()
    } else {
      rightBtn = this.displayRightHeaderBtn()
    }

    return (
      <div className={styles}>
        <AppBar
          elevation={0}
          position="static"
          chainId={chainId}
        >
          <Toolbar>
            <Navigation
              navLinks={navLinks}
              rightBtn={rightBtn}
              chainId={chainId}
              toggleMobileNav={toggleMobileNav}
              onNavigationChange={this.onNavigationChange}
            />
          </Toolbar>
          <IconButton
            id="burger"
            onClick={this.toggleMobileNav}
          >
            {menuIcon}
          </IconButton>
        </AppBar>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    provider: state.provider,
    ui: state.ui
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      ui: bindActionCreators(uiActionCreators, dispatch)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
