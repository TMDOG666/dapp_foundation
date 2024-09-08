require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: "chain",
  networks: {
    chain: {
      url: process.env.HTTP_URL,
      chainId:parseInt(process.env.CHAIN_ID),
      accounts:[process.env.ACCOUNT_PRIVATE_KEY,]
    },
    localgeth: {
      url: "http://127.0.0.1:56211",
      chainId: 3151908,
      accounts:["bcdf20249abf0ed6d944c0288fad489e33f66b3960d9e6229c1cd214ed3bbe31",]
    }
  }
};
