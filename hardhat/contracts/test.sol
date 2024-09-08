// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract Test {
    uint public a;

    event ChangeA(uint a);

    function sendTest (uint num) external {
        a = num;
        emit ChangeA(a);
    }

    function callTest () external view returns(uint){
        return a;
    }
    
}
