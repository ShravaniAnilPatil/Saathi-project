// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./LoanContract.sol";

contract LoanFactory {
    address[] public allLoans;

    function createLoan(
        address borrower,
        address groupPool,
        uint256 interest,
        uint256 duration
    ) external payable {
        LoanContract loan = new LoanContract{value: msg.value}(
            borrower,
            groupPool,
            interest,
            duration
        );

        allLoans.push(address(loan));
    }

    function getLoans() external view returns (address[] memory) {
        return allLoans;
    }
}
