const web3 = require('./web3');
const path = require('path');
const { assert } = require('chai');

// 导入合约的 JSON 文件
const Test = require(path.resolve(__dirname, '../artifacts/contracts/test.sol/Test.json'));

let testContract;
let accounts;

// 测试前的初始化工作
beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    // 部署 Test 合约
    testContract = await new web3.eth.Contract(Test.abi)
        .deploy({ data: Test.bytecode })
        .send({ from: accounts[0], gas: '5000000' });

    console.log("Test 合约已部署" +" "+ testContract.options.address);
});

// 描述 Test 合约的测试用例
describe('Test 合约', () => {
    it('事件测试与调用方法测试', async () => {
        // 新值
        const newValue = 42;

        // 监听事件
        testContract.once('ChangeA', (error, event) => {
            if (error) {
                console.error('事件监听错误:', error);
                assert.fail('事件监听失败');
            }
            console.log('changeA 事件触发:', event);
            // 验证事件数据
            assert.equal(event.returnValues.newValue, newValue, '事件中的新值不正确');
        });
        

        
        testContract.events.ChangeA({
            fromBlock: 0,//从创世区块到
            toBlock: 'latest'//最后的区块
        }, (error, event) => {
            if (error) {
                console.error('事件监听错误:', error);
                return;
            }
    
            console.log('ValueChanged event:', event);//打印
        });


        // 调用 callTest 函数
        const value = await testContract.methods.callTest().call();
        console.log(value);


        // 调用 sendTest 函数
        await testContract.methods.sendTest(newValue).send({ from: accounts[0] }).then(result => {
            console.log(result.events);
        });


        // 验证存储的值
        const storedValue = await testContract.methods.callTest().call();
        console.log(storedValue);
        assert.equal(storedValue, newValue, '存储的值不正确');
    });
});
