// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Lending {
    function ping() external pure returns (string memory) {
        return "pong";
    }

    function lend(address payable receiver) external payable {
        receiver.transfer(msg.value);
    }
}
