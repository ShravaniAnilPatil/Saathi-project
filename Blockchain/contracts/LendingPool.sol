// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TrustScore.sol";

contract LendingPool {
    TrustScore public trustScoreContract;
    
    struct Loan {
        uint256 amount;
        uint256 dueDate;
        bool repaid;
    }
    
    mapping(address => uint256) public lenderDeposits;
    mapping(address => Loan) public borrowerLoans;
    uint256 public totalPoolFunds;
    uint256 public safetyPool;
    
    constructor(address _trustScoreAddress) {
        trustScoreContract = TrustScore(_trustScoreAddress);
    }
    
    // Lenders deposit money
    function deposit() public payable {
        require(msg.value > 0, "Must deposit something");
        lenderDeposits[msg.sender] += msg.value;
        totalPoolFunds += msg.value;
    }
    
    // Borrowers request loan
    function borrow(uint256 amount, uint256 durationDays) public {
        require(borrowerLoans[msg.sender].amount == 0, "Already have loan");
        
        uint256 trustScore = trustScoreContract.getScore(msg.sender);
        require(trustScore >= 50, "Trust score too low");
        
        uint256 maxLoan = (trustScore * 1 ether) / 100; // Max based on score
        require(amount <= maxLoan, "Amount exceeds limit");
        require(amount <= totalPoolFunds, "Not enough in pool");
        
        borrowerLoans[msg.sender] = Loan({
            amount: amount,
            dueDate: block.timestamp + (durationDays * 1 days),
            repaid: false
        });
        
        totalPoolFunds -= amount;
        payable(msg.sender).transfer(amount);
    }
    
    // Borrowers repay loan
    function repay() public payable {
        Loan storage loan = borrowerLoans[msg.sender];
        require(loan.amount > 0, "No active loan");
        require(msg.value >= loan.amount, "Insufficient repayment");
        
        // Calculate interest (10% simple)
        uint256 interest = (loan.amount * 10) / 100;
        uint256 totalRepayment = loan.amount + interest;
        
        // 10% of profit to safety pool
        uint256 safetyPoolContribution = interest / 10;
        safetyPool += safetyPoolContribution;
        
        totalPoolFunds += totalRepayment - safetyPoolContribution;
        loan.repaid = true;
        loan.amount = 0;
    }
    
    // Get loan details
    function getMyLoan() public view returns (uint256, uint256, bool) {
        Loan memory loan = borrowerLoans[msg.sender];
        return (loan.amount, loan.dueDate, loan.repaid);
    }
}