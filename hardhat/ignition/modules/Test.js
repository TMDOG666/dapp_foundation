const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");


module.exports = buildModule("TestModule", (m) => {

  const test = m.contract("Test");

  return { test };
});
