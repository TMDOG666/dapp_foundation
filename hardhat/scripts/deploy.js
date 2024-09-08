// scripts/deploy.js
const hre = require("hardhat");
const fs = require('fs');
const path = require('path');


// npx hardhat run .\scripts\deploy.js
async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("部署合约的账户是:", deployer.address);
  const gasLimit = 10000000; // 根据需要调整

  // 部署 Test 合约
  const TestFactory = await hre.ethers.getContractFactory("Test");//通过合约工厂实例化合约
  const test = await TestFactory.deploy({ gasLimit });
  console.log("Test合约地址:", test.target);


  // 获取部署合约的 ABI 
  const testAbi = await hre.artifacts.readArtifact("Test").then(artifact => artifact.abi);


  // 将所有合约地址、ABI保存到一个 JSON 对象中
  const contract = {
    Test: {
      address: test.target,
      abi: testAbi
    }
  };

  // 存入文件
  const filePath = path.resolve(__dirname,'../../front_end/utils/contract.json');
  const dirPath = path.dirname(filePath);

  // 检查目录是否存在，如果不存在则创建它
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // 写入或创建文件
  fs.writeFileSync(filePath, JSON.stringify(contract, null, 2));

  console.log("部署成功到" + test.runner.provider._networkName);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
