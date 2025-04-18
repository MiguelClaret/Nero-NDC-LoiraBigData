---
sidebar_position: 1
custom_edit_url: null
---

# General system architecture 

# SeedSafe – Technical Architecture

SeedSafe is a decentralized Web3 platform built on the NERO Chain. Its objective is to enable transparent, traceable, and sustainable financing for agricultural producers by tokenizing future harvests, issuing future carbon credits for verified sustainable practices, and providing investors with on-chain guarantees.

---

## Overview of System Features

- Tokenization of future agricultural production via ERC-1155
- Issuance of future carbon credit tokens (TCO₂ – ERC-20) upon auditor validation
- NFT certification combining investment and sustainability impact (ERC-721)
- On-chain investor protection through a decentralized reimbursement fund
- Smart contract-level role segregation for producers, auditors, and investors
- Gasless user experience enabled by Account Abstraction and Paymaster structure

---

## Smart Contract Modules

| Contract         | Description                                                                 |
|------------------|-----------------------------------------------------------------------------|
| `HarvestManager` | Coordinates crop lifecycle: creation, validation, sale, delivery, NFT issuance, and fund integration |
| `TCO2Token`      | ERC-20 token representing future carbon credits; minting restricted to auditors    |
| `NFTCombo`       | ERC-721 NFT that certifies the investor’s contribution and carbon offset    |
| `AgriFinance`    | Handles fund management, reimbursements, Paymaster balance, and reputation  |

---

## Architecture Diagrams and System Perspective

### 1. Sequence Diagram – On-chain Contract Interactions

This diagram represents the dynamic flow of information and calls between agents (producers, auditors, investors) and smart contracts.

<p style={{textAlign: 'center'}}>Figure 1: Sequence Diagram UML</p>
<div style={{margin: 15}}>
    <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/umlDiagramFlow.png").default} style={{width: 800}} alt="UML Diagram Flow" />
        <br />
    </div>
</div>
<p style={{textAlign: 'center'}}>Source: Produced by the Authors (2025).</p>



| Step | Initiator   | Contract         | Function                     | Description                                                                 |
|------|-------------|------------------|------------------------------|-----------------------------------------------------------------------------|
| 1    | Producer    | HarvestManager   | `createHarvest()`           | Registers future crop details                                               |
| 2    | Auditor     | HarvestManager   | `mintHarvest()`             | Approves and mints the harvest token                                        |
| 3    | Manager     | TCO2Token        | `mint()`                    | Issues carbon credit tokens post-verification                              |
| 4    | Investor    | HarvestManager   | `buyToken()`                | Buys fractional ownership of harvest using native NERO tokens              |
| 5    | Producer    | HarvestManager   | `registerHarvestedAmount()` | Declares actual yield post-harvest                                          |
| 6    | Manager     | NFTCombo         | `mintCombo()`               | Issues certification NFT based on crop and TCO₂ data                        |
| 7    | Manager     | AgriFinance      | `updateReputation()`        | Adjusts reputation based on delivery performance                            |

**Perspective**: This diagram provides a linear overview of user interactions and system responses, emphasizing the traceable and conditional nature of each blockchain transaction.

---

### 2. Full Application Architecture – Components and Communication

Illustrates all core layers involved in user interaction, contract execution, and gasless infrastructure.


<p style={{textAlign: 'center'}}>Figure 2: Block Diagram</p>
<div style={{margin: 15}}>
    <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/diagramaBlocos.png").default} style={{width: 800}} alt="Blocks Diagram" />
        <br />
    </div>
</div>
<p style={{textAlign: 'center'}}>Source: Produced by the Authors (2025).</p>



| Component               | Role Description                                                             |
|------------------------|------------------------------------------------------------------------------|
| Frontend + Browser     | Interface where users authenticate and interact with the platform            |
| Smart Wallet (AA)      | Contract-based wallet created per user via StackUp SDK                       |
| EntryPoint + Paymaster | Handles transaction execution and fee sponsorship using NERO infrastructure |
| HarvestManager         | Central contract managing the entire operational logic of the platform       |
| TCO2Token              | Carbon credit issuance for verified sustainable practices                    |
| NFTCombo               | Issues a traceable proof of investment + impact in NFT form                  |
| AgriFinance            | Provides investor protection via fund and tracks user reputation             |

**Perspective**: Offers a macro-level view of the dApp’s ecosystem, from user action to blockchain execution. Demonstrates separation of concerns and flow of data.

---

### 3. Smart Contract UML – Structure and Modularity

Illustrates static relationships and responsibilities of each smart contract module.


<p style={{textAlign: 'center'}}>Figure 3: Class Diagram UML (Contracts)</p>
<div style={{margin: 15}}>
    <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/umlDiagramContracts.png").default} style={{width: 800}} alt="UML Class Diagram" />
        <br />
    </div>
</div>
<p style={{textAlign: 'center'}}>Source: Produced by the Authors (2025).</p>


| Contract        | Key Responsibilities                                                      |
|-----------------|----------------------------------------------------------------------------|
| HarvestManager  | Orchestrates logic for crop token lifecycle                               |
| TCO2Token       | Manages balances of TCO₂ carbon credits with controlled minting           |
| NFTCombo        | Creates NFT certificates with embedded metadata or IPFS linkage          |
| AgriFinance     | Maintains fund logic and Paymaster balance; adjusts user reputations      |
| IPFS            | External service for hosting optional NFT metadata                        |

**Perspective**: Reflects the architectural modularity and encapsulation of responsibilities across contracts. Useful for auditing and future extensibility.

---

## Technology Stack

| Layer            | Technology                              |
|------------------|------------------------------------------|
| Blockchain       | NERO Chain (EVM-compatible)              |
| Wallets          | StackUp SDK (ERC-4337 Smart Wallets)     |
| Paymaster        | NERO AA Platform                         |
| Frontend         | React.js + Tailwind CSS + Ether.js       |
| Authentication   | Auth0 (email/social login)               |
| Metadata         | IPFS / Base64 (optional)                 |

---

## Role Management and Access Control

| Role            | Description                                                                 |
|------------------|------------------------------------------------------------------------------|
| `PRODUCER_ROLE`  | Can register and deliver harvests                                            |
| `AUDITOR_ROLE`   | Can authorize TCO₂ issuance and validate harvests                           |
| `MINTER_ROLE`    | Assigned to HarvestManager by TCO2Token and NFTCombo to enable minting     |

OpenZeppelin’s `AccessControl` is used for robust permission management.

---

## Account Abstraction & Paymaster Workflow

```
flowchart TD
    A[User Initiates Action] --> B[StackUp SDK Creates UserOp]
    B --> C[Paymaster Signs and Forwards]
    C --> D[EntryPoint Validates and Relays]
    D --> E[Smart Contract Executes Transaction]
```


| Component       | Purpose                                                   |
|------------------|------------------------------------------------------------|
| Smart Wallet     | User-specific, contract-based wallet (AA-compliant)       |
| StackUp SDK      | Generates UserOp payloads                                 |
| Paymaster        | Sponsors gas fees for whitelisted transactions            |
| EntryPoint       | Validates UserOp and forwards execution to smart contract |

---

## Payment Architecture

- Transactions are executed using **native NERO tokens** (`msg.value`)
- Upon token purchase:
  - 95% of value is transferred to the producer
  - 5% is allocated to the AgriFinance fund
- Fund balance is used to refund investors in case of partial or total crop failure
---

## Conclusion

AgroChain is designed with modularity, sustainability, and Web3 accessibility in mind. Its infrastructure leverages native blockchain capabilities, gasless UX, and decentralized certification to build trust and efficiency in agricultural financing.

This architecture supports:
- Modular and verifiable contract interactions
- Role-based permissioning
- Extensibility for DAO governance, DeFi integrations, or alternative carbon standards
