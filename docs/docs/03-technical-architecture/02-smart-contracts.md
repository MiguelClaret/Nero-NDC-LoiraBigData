---
sidebar_position: 2
custom_edit_url: null
---

# Smart contract details

This document provides a detailed explanation of each smart contract implemented in the SeedSafe ecosystem, outlining their responsibilities, public functions, and how they interact within the architecture.

---

## `HarvestManager.sol`

**Purpose**: Manages the full lifecycle of a harvest, from creation and validation to tokenization, sale, and delivery.

### Key Components
- **ERC-1155** for representing each unit of future crop
- **AccessControl** with roles: `PRODUCER_ROLE`, `AUDITOR_ROLE`
- Stores all harvest data and investors per harvest
- Interacts with: `TCO2Token`, `AgriFinance`, `NFTCombo`

### Enum: `HarvestStatus`
- `PENDING`
- `VALIDATED`
- `DELIVERED`
- `PARTIAL_LOSS`
- `TOTAL_LOSS`

### Functions
| Function                          | Description                                                                 |
|----------------------------------|-----------------------------------------------------------------------------|
| `createHarvest(...)`             | Creates a new harvest draft with metadata and target delivery               |
| `mintHarvest(...)`               | Called by auditor; mints harvest tokens and optionally mints TCO₂          |
| `buyToken(...)`                  | Enables investors to purchase harvest tokens using NERO tokens             |
| `registerHarvestedAmount(...)`   | Declares how much of the harvest was actually delivered                    |
| `distributeProportionally(...)`  | Delivers tokens to buyers based on actual production and reputation updates|
| `reportTotalLoss(...)`           | Marks the harvest as a complete failure and updates producer reputation    |
| `getStatusHarvest(...)`          | Returns the current status of a harvest                                    |
| `getBuyers(...)`                 | Returns a list of buyers for a specific harvest                            |

---

## `TCO2Token.sol`

**Purpose**: Token representing tokenized carbon credits (ERC-20).

### Roles
- `AUDITOR_ROLE`: Only addresses with this role can mint tokens

### Functions
| Function            | Description                                                                 |
|---------------------|-----------------------------------------------------------------------------|
| `mint(address, amount)` | Mints TCO₂ credits to the target address; called by auditor              |
| `burn(amount)`          | Burns TCO₂ from sender’s wallet (compensation)                            |
| `burnFrom(address, amount)` | Burns tokens from another address (requires allowance)                |

---

## `AgriFinance.sol`

**Purpose**: Manages the reimbursement fund, reputation system, and Paymaster balance.

### Roles
- `ADMIN_ROLE`: Full administrative access (assigned to system owner)

### Functions
| Function                            | Description                                                               |
|-------------------------------------|---------------------------------------------------------------------------|
| `contribute(harvestId)`             | Adds funds to the guarantee fund for a specific harvest                  |
| `distributeReimbursement(...)`      | Sends partial refunds to investors (manual trigger)                      |
| `updateReputation(address, score)`  | Updates the producer’s reputation based on harvest outcome              |
| `getReputation(address)`            | Returns the current reputation score                                     |
| `rechargePaymaster()`               | Adds funds to the system’s Paymaster                                     |
| `consumePaymaster(value)`           | Consumes part of Paymaster balance (used for gas sponsorships)          |
| `getPaymasterBalance()`             | Returns current Paymaster balance                                        |

---

## `NFTCombo.sol`

**Purpose**: Issues a composable ERC-721 NFT that contains metadata about the crop and carbon compensation.

### Roles
- `MINTER_ROLE`: Assigned to HarvestManager; only it can mint NFTs.

### Metadata Fields (On-chain)
- Crop name
- Quantity in kg
- TCO₂ credited
- Harvest status

### Functions
| Function                                          | Description                                                        |
|---------------------------------------------------|--------------------------------------------------------------------|
| `mintCombo(address, crop, qtyKg, tco2, status)`   | Creates a new NFT with embedded data                              |
| `tokenURI(tokenId)`                              | Returns base64-encoded JSON with attributes                       |

---

## Integration Notes
- HarvestManager uses `MINTER_ROLE` on TCO2Token and NFTCombo
- Role separation ensures validation/minting cannot be manipulated by external users
- Contracts are fully modular and independently testable

> This smart contract structure enables a secure and verifiable decentralized finance system for sustainable agriculture.

