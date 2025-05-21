// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./BaseAccessControl.sol";
import "./TCO2Token.sol";
import "./AgriFinance.sol";

contract HarvestManager is ERC1155, BaseAccessControl {
    uint256 public currentHarvestId = 0;

    TCO2Token public tco2Token;
    AgriFinance public agriFinance;

    enum HarvestStatus { PENDING, VALIDATED, DELIVERED, PARTIAL_LOSS, TOTAL_LOSS }

    struct Harvest {
        string crop;
        uint256 quantity;
        uint256 pricePerUnit;
        uint256 deliveryDate;
        address producer;
        HarvestStatus status;
        uint256 harvestedAmount;
        string documentation;
    }

    mapping(uint256 => Harvest) public harvests;
    mapping(uint256 => address[]) public buyers;

    constructor(address _tco2TokenAddress, address _agriFinanceAddress)
        ERC1155("https://gateway.pinata.cloud/ipfs/{id}.json")
    {
        tco2Token = TCO2Token(_tco2TokenAddress);
        agriFinance = AgriFinance(payable(_agriFinanceAddress));
    }

    function createHarvest(
        string memory crop,
        uint256 quantity,
        uint256 price,
        uint256 deliveryDate,
        string memory doc
    ) external onlyRole(PRODUCER_ROLE) {
        harvests[currentHarvestId] = Harvest({
            crop: crop,
            quantity: quantity,
            pricePerUnit: price,
            deliveryDate: deliveryDate,
            producer: msg.sender,
            status: HarvestStatus.PENDING,
            harvestedAmount: 0,
            documentation: doc
        });
        currentHarvestId++;
    }

    function mintHarvest(address to, uint256 harvestId, uint256 tco2Amount)
        external
        onlyRole(AUDITOR_ROLE)
    {
        Harvest storage h = harvests[harvestId];
        require(h.status == HarvestStatus.PENDING, "Already validated");

        _mint(to, harvestId, h.quantity, "");
        h.status = HarvestStatus.VALIDATED;

        if (tco2Amount > 0) {
            tco2Token.mint(h.producer, tco2Amount);
        }
    }

    function buyToken(uint256 harvestId, uint256 amount) external payable {
        Harvest memory h = harvests[harvestId];
        require(h.status == HarvestStatus.VALIDATED, "Not available");

        uint256 totalCost = amount * h.pricePerUnit;
        require(msg.value >= totalCost, "Insufficient NERO");

        uint256 fee = (totalCost * 5) / 100;
        uint256 producerAmount = totalCost - fee;

        // Paga o produtor
        (bool sent1, ) = payable(h.producer).call{value: producerAmount}("");
        require(sent1, "Transfer to producer failed");

        // Envia para o fundo
        (bool sent2, ) = payable(address(agriFinance)).call{value: fee}("");
        require(sent2, "Transfer to fund failed");

        // Registra contribuição
        agriFinance.contribute{value: fee}(harvestId);

        _safeTransferFrom(h.producer, msg.sender, harvestId, amount, "");
        buyers[harvestId].push(msg.sender);
    }

    function registerHarvestedAmount(uint256 harvestId, uint256 realAmount)
        external
        onlyRole(PRODUCER_ROLE)
    {
        Harvest storage h = harvests[harvestId];
        require(h.status == HarvestStatus.VALIDATED, "Not yet validated");
        h.harvestedAmount = realAmount;
    }

    function distributeProportionally(uint256 harvestId)
        external
        onlyRole(PRODUCER_ROLE)
    {
        Harvest storage h = harvests[harvestId];
        require(h.harvestedAmount > 0, "Harvest not declared");
        require(h.status == HarvestStatus.VALIDATED, "Invalid status");

        uint256 delivered = h.harvestedAmount;
        uint256 total = h.quantity;
        uint256 percentDelivered = (delivered * 100) / total;

        address[] memory investorList = buyers[harvestId];
        for (uint i = 0; i < investorList.length; i++) {
            address investor = investorList[i];
            uint256 balance = balanceOf(investor, harvestId);
            uint256 finalDelivery = (balance * percentDelivered) / 100;

            safeTransferFrom(h.producer, investor, harvestId, finalDelivery, "");
        }

        if (percentDelivered == 100) {
            h.status = HarvestStatus.DELIVERED;
            agriFinance.updateReputation(h.producer, 100);
        } else {
            h.status = HarvestStatus.PARTIAL_LOSS;
            agriFinance.updateReputation(h.producer, 60);
        }
    }

    function reportTotalLoss(uint256 harvestId)
        external
        onlyRole(PRODUCER_ROLE)
    {
        Harvest storage h = harvests[harvestId];
        require(h.status == HarvestStatus.VALIDATED, "Invalid status");
        h.status = HarvestStatus.TOTAL_LOSS;

        agriFinance.updateReputation(h.producer, 20);
    }

    function getStatusHarvest(uint256 harvestId) external view returns (HarvestStatus) {
        return harvests[harvestId].status;
    }

    function getBuyers(uint256 harvestId) external view returns (address[] memory) {
        return buyers[harvestId];
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function getAvailableHarvests() external view returns (Harvest[] memory) 
    {
        uint256 count = 0;

        // Primeiro, contar quantas estão válidas
        for (uint256 i = 0; i < currentHarvestId; i++) {
            Harvest storage h = harvests[i];
            if (
                h.status == HarvestStatus.VALIDATED &&
                h.pricePerUnit > 0 &&
                h.deliveryDate > block.timestamp
            ) {
                count++;
            }
        }

        // Criar array com tamanho correto
        Harvest[] memory available = new Harvest[](count);
        uint256 j = 0;

        for (uint256 i = 0; i < currentHarvestId; i++) {
            Harvest storage h = harvests[i];
            if (
                h.status == HarvestStatus.VALIDATED &&
                h.pricePerUnit > 0 &&
                h.deliveryDate > block.timestamp
            ) {
                available[j] = h;
                j++;
            }
        }

        return available;
    }
}