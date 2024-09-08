import Contract from './contract.json';
import Web3 from 'web3';

let web3;
let wsWeb3;

console.log(process.env.WEBSTOCK_URL)

// 根据环境初始化 web3 实例（浏览器或服务器）
if (typeof window !== 'undefined') {
    // 判断是否在浏览器环境下

    if (window.ethereum) {
        // 现代 dapp 浏览器，通常是 MetaMask 或类似插件
        web3 = new Web3(window.ethereum);
        try {
            // 请求用户授权访问账户
            window.ethereum.request({ method: 'eth_requestAccounts' });
        } catch (error) {
            console.error("用户拒绝了账户访问请求", error);
        }
        // 初始化 WebSocket 连接
        wsWeb3 = new Web3(new Web3.providers.WebsocketProvider(process.env.WEBSTOCK_URL));
    } else if (window.web3) {
        // 兼容旧版 dapp 浏览器（例如早期的 MetaMask）
        web3 = new Web3(window.web3.currentProvider);
    }
} else {
    // 服务器环境下使用 WEBSTOCK Provider 初始化 web3
    
    const provider = new Web3.providers.HttpProvider(process.env.HTTP_URL);
    web3 = new Web3(provider);
}

// 导出 web3 和 wsWeb3 实例
export default { web3, wsWeb3 };

// 获取账户地址
export async function getAccounts() {
    try {
        return await web3.eth.getAccounts();
    } catch (error) {
        console.error("获取账户地址失败", error);
        throw error;
    }
}

// 获取合约实例
export async function getContractInstance(contractName) {
    const contract = Contract[contractName];
    if (!contract) {
        throw new Error(`未找到名为 ${contractName} 的合约`);
    }
    return new web3.eth.Contract(contract.abi, contract.address);
}

// 获取 WebSocket 合约实例
export async function getWsContractInstance(contractName) {
    const contract = Contract[contractName];
    if (!contract) {
        throw new Error(`未找到名为 ${contractName} 的合约`);
    }
    return new wsWeb3.eth.Contract(contract.abi, contract.address);
}

// 获取合约地址
export async function getContractAddress(contractName) {
    const contract = Contract[contractName];
    if (!contract) {
        throw new Error(`未找到名为 ${contractName} 的合约`);
    }
    return contract.address;
}

// 获取合约 ABI
export async function getContractABI(contractName) {
    const contract = Contract[contractName];
    if (!contract) {
        throw new Error(`未找到名为 ${contractName} 的合约`);
    }
    return contract.abi;
}

// 单位转换：wei => ether
export function fromWeiToEther(num) {
    try {
        return web3.utils.fromWei(BigInt(num), 'ether');
    } catch (error) {
        console.error("单位转换失败", error);
        throw error;
    }
}

// 查询 ETH 余额
export async function getBalance() {
    try {
        const accounts = await getAccounts();
        const balance = await web3.eth.getBalance(accounts[0]);
        return fromWeiToEther(balance);
    } catch (error) {
        console.error("获取余额失败", error);
        throw error;
    }
}

// 调用合约的 call 方法（合约名、方法名、传入参数）
export async function callContractMethod(contractName, methodName, ...args) {
    try {
        const contract = await getContractInstance(contractName);
        const accounts = await getAccounts();
        return await contract.methods[methodName](...args).call({ from: accounts[0] });
    } catch (error) {
        console.error(`调用合约方法 ${methodName} 失败`, error);
        throw error;
    }
}

// 调用合约的 send 方法（合约名、方法名、value、gas、传入参数）
export async function sendContractMethod(contractName, methodName, value, gas, ...args) {
    try {
        const contract = await getContractInstance(contractName);
        const accounts = await getAccounts();
        return await contract.methods[methodName](...args).send({ from: accounts[0], value, gas });
    } catch (error) {
        console.error(`调用合约方法 ${methodName} 失败`, error);
        throw error;
    }
}

// 事件监听
export async function eventListener(contractName, eventName, options) {
    try {
        const contract = await getWsContractInstance(contractName);
        return contract.events[eventName](options);
    } catch (error) {
        console.error('设置事件监听器时出错:', error);
        throw error;
    }
}
