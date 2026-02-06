// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ITrustScore {
    function recordSuccessfulLoan(address user) external;
}

contract Lending {
    address public safetyPool;
    ITrustScore public trustScore;

    uint256 public constant SAFETY_FEE_PERCENT = 5; // 5%

    event LoanExecuted(
        address indexed lender,
        address indexed borrower,
        uint256 amount,
        uint256 safetyContribution
    );

    constructor(address _trustScore, address _safetyPool) {
        trustScore = ITrustScore(_trustScore);
        safetyPool = _safetyPool;
    }

    function lend(address payable borrower) external payable {
        require(msg.value > 0, "No ETH sent");

        uint256 safetyFee = (msg.value * SAFETY_FEE_PERCENT) / 100;
        uint256 loanAmount = msg.value - safetyFee;

        // Transfer ETH
        borrower.transfer(loanAmount);
        payable(safetyPool).transfer(safetyFee);

        // Update trust score
        trustScore.recordSuccessfulLoan(borrower);

        emit LoanExecuted(
            msg.sender,
            borrower,
            loanAmount,
            safetyFee
        );
    }
}
