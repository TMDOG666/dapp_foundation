// const Web3 = require('web3');
const { Web3 } = require("web3");

const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));

module.exports = web3;

