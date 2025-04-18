---
sidebar_position: 1
custom_edit_url: null
---

# Overview of AA integration

## Introduction

&emsp;Seed Safe integrates the Account Abstraction (ERC-4337) model through NERO Chain infrastructure to enable gasless, intuitive, and accessible transactions for small farmers, investors, and stakeholders in the agro-environmental chain.

&emsp;This approach removes the barrier of needing native tokens (such as ETH) to interact with smart contracts, while providing a scalable and secure architecture for complex operations like crop tokenization, traceability, and carbon offsetting.

## What is Account Abstraction and Why We Use It

&emsp;Account Abstraction (AA) allows user accounts to be **customizable smart contracts**, called **Smart Accounts**, instead of simple wallets controlled by private keys.

At Seed Safe, we use AA to:

- Create programmable wallets (no MetaMask required)
- Allow users to interact without holding gas tokens
- Enable a **gasless model** supported by NERO’s Paymaster
- Facilitate onboarding for non-technical users with a Web2-like experience

## How Seed Safe's Architecture Connects with AA

### Simplified Usage Flow:

1. The user accesses the dApp and automatically creates a **Smart Account**
2. Upon interaction (e.g., purchasing a crop), a **UserOperation** is created
3. The operation is sent to a **Bundler**
4. The Bundler forwards the operation to NERO Chain’s **EntryPoint**
5. NERO’s **Paymaster** validates and covers the gas cost
6. The **Seed Safe contract** executes the function as usual
7. The user receives the result — without paying any fees

### Components Used:

| Component         | Function                                                       |
|------------------|----------------------------------------------------------------|
| Smart Account     | Represents the user with signing and validation logic          |
| UserOperation     | Structure that packages the transaction                        |
| Bundler (NERO)    | Forwards operations to the network                             |
| EntryPoint (NERO) | Validates and executes operations with Paymaster support       |
| Paymaster (NERO)  | Sponsors the cost of the transaction                           |

## Practical Applications of AA in Seed Safe

&emsp;The AA architecture is integrated into the platform’s core operations, such as:

- **Purchasing crop tokens** (`buyToken`)
- **Minting ESG certificates** (`mintCombo`)
- **Registering harvest or total loss**
- **Burning carbon credits** (`burn`)
- **Crop distribution and automated compensations**

&emsp;These actions are packaged as UserOperations and executed gasless via the NERO Chain infrastructure.

## Sustaining the Gasless Model

&emsp;Although Seed Safe **does not use a custom Paymaster**, the use of **NERO’s Paymaster** ensures gas coverage for end users. To support the sustainability of the model, the platform applies a percentage fee (e.g., 2%) on commercial transactions, which is accumulated in the `AgriFinance.sol` contract.

&emsp;This fund may be used in the future to:

- Subsidize the Paymaster
- Support institutional actions to maintain the gasless experience
- Finance compensations and guarantees in agricultural cycles

## Benefits of the AA Approach

- **Frictionless access:** any user can interact even without tokens
- **Automatic onboarding:** wallet creation upon accessing the platform
- **Web2-like experience:** asynchronous, simple, and user-friendly transactions
- **Programmable security:** customized logic via Smart Account
- **Scalability:** architecture ready for high volume with efficiency

## Conclusion

&emsp;By integrating NERO Chain’s Account Abstraction infrastructure, Seed Safe ensures an accessible, gasless experience ready for mass adoption. This choice aligns the platform with the principles of decentralization, inclusion, and efficiency — all essential to transforming how small farmers, investors, and environmental agents interact with the digital agribusiness of the future.

## Bibliography
- SINGH, Aniket Kumar et al. Account abstraction via singleton entrypoint contract and verifying paymaster. In: 2023 2nd International Conference on Edge Computing and Applications (ICECAA). IEEE, 2023. p. 1598-1605.
- OJOG, Silviu; MIRON, Alina-Andrea. Account Abstraction: The Key to Blockchain Reporting. Informatica Economica, v. 28, n. 3, p. 73-81, 2024.
- WANG, Qin; CHEN, Shiping. Account abstraction, analysed. In: 2023 IEEE International Conference on Blockchain (Blockchain). IEEE, 2023. p. 323-331.