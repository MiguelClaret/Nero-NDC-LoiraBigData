// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract AgriFinance is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    mapping(uint256 => uint256) public fundByHarvest;
    mapping(address => uint256) public reputation;
    uint256 public paymasterBalance;

    event FundoContribuido(uint256 harvestId, uint256 value);
    event ReembolsoDistribuido(uint256 harvestId, address to, uint256 value);
    event ReputacaoAtualizada(address producer, uint256 score);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    // 💰 Fundo de Garantia
    function contribute(uint256 harvestId) external payable {
        require(msg.value > 0, "Sem valor");
        fundByHarvest[harvestId] += msg.value;
        emit FundoContribuido(harvestId, msg.value);
    }

    function distributeReimbursement(
        uint256 harvestId,
        address[] calldata investidores,
        uint256[] calldata valores
    ) external onlyRole(ADMIN_ROLE) {
        require(investidores.length == valores.length, "Dados inconsistentes");

        for (uint i = 0; i < investidores.length; i++) {
            payable(investidores[i]).transfer(valores[i]);
            emit ReembolsoDistribuido(harvestId, investidores[i], valores[i]);
        }
    }

    // ⭐ Reputacao
    function updateReputation(address producer, uint256 score) external onlyRole(ADMIN_ROLE) {
        reputation[producer] = score;
        emit ReputacaoAtualizada(producer, score);
    }

    function getReputation(address producer) external view returns (uint256) {
        return reputation[producer];
    }

    // ⛽ Paymaster
    function rechargePaymaster() external payable onlyRole(ADMIN_ROLE) {
        require(msg.value > 0, "Sem valor");
        paymasterBalance += msg.value;
    }

    function getPaymasterBalance() external view returns (uint256) {
        return paymasterBalance;
    }

    function consumePaymaster(uint256 value) external onlyRole(ADMIN_ROLE) {
        require(value <= paymasterBalance, "Saldo insuficiente");
        paymasterBalance -= value;
    }
}