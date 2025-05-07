require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  paths: {
    sources: "./src/contracts",
    artifacts: "./artifacts",
  },
  networks: {
    nero: {
      url: process.env.NERO_RPC_URL || "https://rpc.nerochain.io",
      chainId: 1689,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      nero: "48268a7dfe829b9481bf4170ea92e940f9b653dbbbef7589c0c9edd4d41deb60"
    },
    customChains: [
      {
        network: "nero",
        chainId: 1689,
        urls: {
          apiURL: "https://api.nerochain.io/api",
          browserURL: "https://explorer.nerochain.io"
        }
      }
    ]
  }
}; 