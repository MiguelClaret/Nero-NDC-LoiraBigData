// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./BaseAccessControl.sol";

contract TCO2Token is ERC20, BaseAccessControl {
    constructor() ERC20("Tokenized Carbon Offset", "TCO2") {}

    /// @notice Mint TCO2 credits to an address
    /// @dev Only auditors can mint
    function mint(address to, uint256 amount) external onlyRole(AUDITOR_ROLE) {
        _mint(to, amount);
    }

    /// @notice Burn tokens from the caller
    /// @dev Used for carbon compensation
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    /// @notice Burn tokens from another address (requires allowance)
    function burnFrom(address account, uint256 amount) external {
        _spendAllowance(account, msg.sender, amount);
        _burn(account, amount);
    }

    /// @dev Resolves inheritance conflict (ERC20 vs AccessControl)
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}