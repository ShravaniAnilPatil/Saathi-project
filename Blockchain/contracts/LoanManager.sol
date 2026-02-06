// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ITrustScore {
    function getScore(address user) external view returns (uint256);
}

contract LoanManager {

    ITrustScore public trustScoreContract;
    address public admin;
    uint256 public minTrustScore;

    constructor(address _trustScoreAddress) {
        trustScoreContract = ITrustScore(_trustScoreAddress);
        admin = msg.sender;
        minTrustScore = 40; // Default minimum trust score
    }

    struct Loan {
        address borrower;
        address lender;
        uint256 amount;
        uint256 interestRate; // Interest rate in basis points (e.g., 500 = 5%)
        uint256 duration;
        uint256 createdAt;
        bool funded;
        bool repaid;
        bool withdrawn;
    }

    Loan[] public loans;

    event LoanRequested(uint256 loanId, address borrower, uint256 amount, uint256 interestRate);
    event LoanFunded(uint256 loanId, address lender);
    event LoanWithdrawn(uint256 loanId);
    event LoanRepaid(uint256 loanId, uint256 totalRepaid, uint256 interest);
    event MinTrustScoreUpdated(uint256 newScore);

    // Calculate interest rate based on trust score
    // Higher trust score = lower interest rate
    function getInterestRate(uint256 trustScore) public pure returns (uint256) {
        if (trustScore >= 90) return 300;      // 3% for excellent credit
        if (trustScore >= 75) return 500;      // 5% for good credit
        if (trustScore >= 60) return 800;      // 8% for fair credit
        if (trustScore >= 50) return 1200;     // 12% for poor credit
        return 1500;                           // 15% for very poor credit
    }

    // Calculate total repayment amount (principal + interest)
    function calculateRepayment(uint256 loanId) public view returns (uint256) {
        Loan memory loan = loans[loanId];
        uint256 interest = (loan.amount * loan.interestRate) / 10000;
        return loan.amount + interest;
    }

    // Admin function to update minimum trust score
    function setMinTrustScore(uint256 _minScore) public {
        require(msg.sender == admin, "Only admin can set minimum trust score");
        require(_minScore <= 100, "Score must be 0-100");
        minTrustScore = _minScore;
        emit MinTrustScoreUpdated(_minScore);
    }

    // ------------------------------
    // BORROWER CREATES LOAN REQUEST
    // ------------------------------
    function createLoan(uint256 amount, uint256 duration) public {

        uint256 score = trustScoreContract.getScore(msg.sender);
        require(score >= minTrustScore, "Trust score too low");

        uint256 interestRate = getInterestRate(score);

        loans.push(
            Loan({
                borrower: msg.sender,
                lender: address(0),
                amount: amount,
                interestRate: interestRate,
                duration: duration,
                createdAt: block.timestamp,
                funded: false,
                repaid: false,
                withdrawn: false
            })
        );

        emit LoanRequested(loans.length - 1, msg.sender, amount, interestRate);
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
        require(loan.lender != address(0), "Invalid lender address");

        // Calculate total repayment (principal + interest)
        uint256 totalRepayment = calculateRepayment(loanId);
        require(msg.value >= totalRepayment, "Insufficient repayment amount");

        // Calculate interest amount
        uint256 interest = totalRepayment - loan.amount;

        // Transfer to lender first, then mark as repaid
        payable(loan.lender).transfer(totalRepayment);

        loan.repaid = true;

        emit LoanRepaid(loanId, totalRepayment, interest);

        // Return excess payment if any
        if (msg.value > totalRepayment) {
            payable(msg.sender).transfer(msg.value - totalRepayment);
        }
    }

    // ------------------------------
    // GET ALL LOANS
    // ------------------------------
    function getLoans() public view returns (Loan[] memory) {
        return loans;
    }
}
