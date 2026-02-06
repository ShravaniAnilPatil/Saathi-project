// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IGroupPool {
    function CONTRIBUTION_PERCENT() external view returns (uint256);
}

contract LoanContract {
    address public lender;
    address public borrower;
    address public groupPool;

    uint256 public principal;
    uint256 public interest;
    uint256 public dueDate;
    bool public repaid;

    modifier onlyBorrower() {
        require(msg.sender == borrower, "Not borrower");
        _;
    }

    constructor(
        address _borrower,
        address _groupPool,
        uint256 _interest,
        uint256 _duration
    ) payable {
        lender = msg.sender;
        borrower = _borrower;
        groupPool = _groupPool;

        principal = msg.value;
        interest = _interest;
        dueDate = block.timestamp + _duration;
    }

    function repay() external payable onlyBorrower {
        require(!repaid, "Already repaid");
        require(msg.value == principal + interest, "Incorrect amount");

        uint256 poolShare = (interest * 10) / 100; // 10% to pool
        uint256 lenderShare = principal + (interest - poolShare);

        repaid = true;

        payable(lender).transfer(lenderShare);
        payable(groupPool).transfer(poolShare);
    }

    function isDefaulted() public view returns (bool) {
        return block.timestamp > dueDate && !repaid;
    }
}
