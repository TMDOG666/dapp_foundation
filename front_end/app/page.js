// app/test/page.js
"use client";
import { useState, useEffect } from 'react';
// 导入web3工具
import { getAccounts, getBalance, callContractMethod, sendContractMethod, eventListener } from '@/utils/web3Utils';

export default function TestPage() {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [events, setEvents] = useState([]); // 修改为复数以便存储多个事件
  const [contractValue, setContractValue] = useState(0);
  const [inputValue, setInputValue] = useState(0);

  useEffect(() => {
    async function fetchData() {
        try {
            const accounts = await getAccounts();
            setAccount(accounts[0]);

            const balance = await getBalance();
            setBalance(balance);

            // 调用Call方法
            const value = await callContractMethod('Test', 'callTest');
            setContractValue(parseInt(value));

            // 事件监听
            const eventListenerInstance = await eventListener('Test', 'ChangeA', {
                filter: {},
                fromBlock: 0, // 从创世区块开始监听
                toBlock: 'latest' // 到最新区块结束
            });

            eventListenerInstance.on('data', (event) => {
                // 每次监听到事件时，将其添加到事件列表中
                setEvents((events) => [event.returnValues]);
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    fetchData();
  }, []);

  const handleSend = async () => {
    if (inputValue) {
      // 调用send方法
      await sendContractMethod('Test', 'sendTest', 0, '3000000', inputValue);
      const value = await callContractMethod('Test', 'callTest');
      setContractValue(parseInt(value));
    }
  };

  return (
    <div>
      <h1>测试页面</h1>
      <p>Account: {account}</p>
      <p>Balance: {balance} ETH</p>
      <p>Contract Value: {contractValue}</p>

      <div>
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={handleSend}>Send</button>
      </div>

      <h2>事件监听</h2>
      <div>
        {events.length > 0 ? (
          events.map((event, index) => (
            <>
            <div key={index}>
              <p>Event {index + 1}:</p>
              {Object.entries(event).map(([key, value]) => (
                <p key={key}>{key}: {parseInt(value)}</p>
              ))}
            </div>
            <br />
            </>
          ))
        ) : (
          <p>尚未监听到事件</p>
        )}
      </div>
      
    </div>
  );
}
