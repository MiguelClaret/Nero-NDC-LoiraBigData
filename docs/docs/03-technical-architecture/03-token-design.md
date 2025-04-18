---
sidebar_position: 3
custom_edit_url: null
---

# Token design 

This document outlines the design, behavior, and purpose of each token used in the SeedSafe protocol, including metadata structure, standards, lifecycle, and interoperability.

---

## 1. Harvest Token (ERC-1155)

**Contract**: `HarvestManager.sol`  
**Standard**: [ERC-1155](https://eips.ethereum.org/EIPS/eip-1155) (Multi-token standard)

### Purpose
Represents a unit of future agricultural production (e.g., 1kg of crop X), tokenized and sold to investors.

### Properties
| Attribute          | Value                                    |
|--------------------|------------------------------------------|
| Token ID           | `uint256` (one ID per harvest batch)     |
| Fungibility        | Fungible per batch (can be split/transferred) |
| Metadata URI       | Static Pinata/IPFS link per harvest type |

### Lifecycle
1. **Creation** – A producer registers a new harvest.
2. **Validation** – Auditor mints ERC-1155 tokens representing the validated quantity.
3. **Sale** – Investors purchase fractions via `buyToken()`.
4. **Delivery** – Upon harvest, tokens are delivered proportionally.

### Notes
- Tokens are transferred between producer and investor.
- These tokens are **destroyed or replaced** in case of total loss.

---

## 2. TCO₂ Token (ERC-20)

**Contract**: `TCO2Token.sol`  
**Standard**: [ERC-20](https://eips.ethereum.org/EIPS/eip-20)

### Purpose
Represents a tokenized future carbon credit generated through verified crops and ther potential.

### Properties
| Attribute        | Value                                  |
|------------------|------------------------------------------|
| Name             | `Tokenized Future Carbon Offset`               |
| Symbol           | `TCO2`                                   |
| Decimals         | 18                                       |
| Mint Authority   | Only addresses with `AUDITOR_ROLE`      |

### Lifecycle
1. **Issued** when an auditor validates a crop.
2. **Traded** as a normal ERC-20 asset.
3. **Burned** when a user wants to represente compensate their emissions (still not integrate into the blockchain system)

### Notes
- Integrated with `HarvestManager` during `mintHarvest()` if eligible.

---

## 3. NFT Combo Certificate (ERC-721)

**Contract**: `NFTCombo.sol`  
**Standard**: [ERC-721](https://eips.ethereum.org/EIPS/eip-721)

### Purpose
Represents an immutable digital certificate that combines a harvest investment and environmental impact.

### Metadata Structure (Base64-encoded JSON)
```json
{
  "name": "Safra + Carbono #123",
  "description": "NFT Certificate for agricultural harvest + carbon offset",
  "attributes": [
    {"trait_type": "Crop", "value": "Coffee"},
    {"trait_type": "Quantity (kg)", "value": "1000"},
    {"trait_type": "TCO2", "value": "500"},
    {"trait_type": "Status", "value": "Delivered"}
  ]
}
```

### Lifecycle
1. **Minted** only by `HarvestManager` (via `MINTER_ROLE`) upon harvest delivery or confirmation.
2. **Permanent** once minted – not transferable in current logic.

### Notes
- Metadata is dynamic and embedded on-chain via Base64.
- Each NFT provides a **proof of ESG impact + ownership**.

---

## Summary Table

| Token            | Standard | Fungibility | Purpose                           | Issuer           | Transferable |
|------------------|----------|-------------|-----------------------------------|------------------|--------------|
| Harvest Token    | ERC-1155 | Yes         | Represents units of future crops  | HarvestManager   | Yes          |
| TCO₂             | ERC-20   | Yes         | Tokenized future carbon offset           | Auditor          | Yes          |
| NFT Combo        | ERC-721  | No          | Certificate of investment + ESG   | HarvestManager   | No         |


---

This token structure enables a multi-asset, reputation-aware, and ESG-aligned infrastructure for decentralized agricultural finance and traceability.





