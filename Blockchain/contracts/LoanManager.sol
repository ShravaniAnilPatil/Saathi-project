// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ITrustScore {
    function getScore(address user) external view returns (uint256);
}

contract LoanManager {

    ITrustScore public trustScoreContract;

    constructor(address _trustScoreAddress) {
        trustScoreContract = ITrustScore(_trustScoreAddress);
    }

    struct Loan {
        address borrower;
        address lender;
        uint256 amount;
        uint256 duration;
        uint256 createdAt;
        bool funded;
        bool repaid;
        bool withdrawn;
    }

    Loan[] public loans;

    event LoanRequested(uint256 loanId, address borrower, uint256 amount);
    event LoanFunded(uint256 loanId, address lender);
    event LoanWithdrawn(uint256 loanId);
    event LoanRepaid(uint256 loanId);

    // ------------------------------
    // BORROWER CREATES LOAN REQUEST
    // ------------------------------
    function createLoan(uint256 amount, uint256 duration) public {

        uint256 score = trustScoreContract.getScore(msg.sender);
        require(score >= 40, "Trust score too low");

        loans.push(
            Loan({
                borrower: msg.sender,
                lender: address(0),
                amount: amount,
                duration: duration,
                createdAt: block.timestamp,
                funded: false,
                repaid: false,
                withdrawn: false
            })
        );

        emit LoanRequested(loans.length - 1, msg.sender, amount);
    }

    // ------------------------------
    // LENDER FUNDS LOAN
    // ------------------------------
    function fundLoan(uint256 loanId) public payable {

        Loan storage loan = loans[loanId];

        require(!loan.funded, "Already funded");
        require(msg.value == loan.amount, "Incorrect ETH amount");

        loan.lender = msg.sender;
        loan.funded = true;

        emit LoanFunded(loanId, msg.sender);
    }

    // ------------------------------
    // BORROWER WITHDRAWS FUNDS
    // ------------------------------
    function withdrawLoan(uint256 loanId) public {

        Loan storage loan = loans[loanId];

        require(msg.sender == loan.borrower, "Not borrower");
        require(loan.funded, "Loan not funded");
        require(!loan.withdrawn, "Already withdrawn");

        loan.withdrawn = true;

        payable(msg.sender).transfer(loan.amount);

        emit LoanWithdrawn(loanId);
    }

    // ------------------------------
    // BORROWER REPAYS LOAN
    // ------------------------------
    function repayLoan(uint256 loanId) public payable {

        Loan storage loan = loans[loanId];

        require(msg.sender == loan.borrower, "Not borrower");
        require(loan.withdrawn, "Loan not withdrawn");
        require(!loan.repaid, "Already repaid");
        require(msg.value == loan.amount, "Incorrect repayment");

        loan.repaid = true;

        payable(loan.lender).transfer(msg.value);

        emit LoanRepaid(loanId);
    }

    // ------------------------------
    // GET ALL LOANS
    // ------------------------------
    function getLoans() public view returns (Loan[] memory) {
        return loans;
    }
}
