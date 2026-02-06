// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SafetyPool {
    uint256 public totalPoolBalance;

    event PoolFunded(uint256 amount);
    event CompensationPaid(address lender, uint256 amount);

    receive() external payable {
        totalPoolBalance += msg.value;
        emit PoolFunded(msg.value);
    }

    function compensateLoss(address payable lender, uint256 lossAmount) external {
        uint256 compensation = (lossAmount * 30) / 100; // 30% loss coverage

        require(compensation <= totalPoolBalance, "Insufficient pool balance");

        totalPoolBalance -= compensation;
        lender.transfer(compensation);

        emit CompensationPaid(lender, compensation);
    }
}
