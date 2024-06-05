// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

contract CompanyERC20Token is ERC20, Ownable, ERC20Capped {
    uint immutable cappedTokenSupply = 77000000 * (10**18); 

    constructor(
        string memory name,
        string memory symbol,
        uint decimals,
        address initialOwner_
    )
        ERC20(name, symbol)
        Ownable(initialOwner_)
        ERC20Capped(cappedTokenSupply)
    {}

    /* Mint new tokens (Cannot exceed hard-capped totaly supply) */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    /* Overriding function found in both ERC20 & ERC20Capped */
    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20, ERC20Capped) {
        super._update(from, to, value);
    }
}