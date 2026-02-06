// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract GroupPool {
    address public admin;
    uint256 public totalPoolBalance;
    uint256 public constant CONTRIBUTION_PERCENT = 10;

    mapping(address => bool) public isMember;
    address[] public members;

    struct Claim {
        address claimant;
        uint256 amount;
        uint256 approvals;
        bool executed;
    }

    mapping(uint256 => Claim) public claims;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    uint256 public claimCount;

    modifier onlyMember() {
        require(isMember[msg.sender], "Not a group member");
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    constructor() {
        admin = msg.sender;
        isMember[msg.sender] = true;
        members.push(msg.sender);
    }

    // -----------------------
    // MEMBER MANAGEMENT
    // -----------------------
    function addMember(address _member) external onlyAdmin {
        require(!isMember[_member], "Already member");
        isMember[_member] = true;
        members.push(_member);
    }

    function memberCount() public view returns (uint256) {
        return members.length;
    }

    // -----------------------
    // PROFIT COLLECTION
    // -----------------------
    receive() external payable {
        totalPoolBalance += msg.value;
    }

    // -----------------------
    // LOSS CLAIM SYSTEM
    // -----------------------
    function createClaim(uint256 _amount) external onlyMember {
        require(_amount <= totalPoolBalance, "Insufficient pool funds");

        claims[claimCount] = Claim({
            claimant: msg.sender,
            amount: _amount,
            approvals: 0,
            executed: false
        });

        claimCount++;
    }

    function voteClaim(uint256 _claimId) external onlyMember {
        Claim storage claim = claims[_claimId];

        require(!claim.executed, "Already executed");
        require(!hasVoted[_claimId][msg.sender], "Already voted");

        hasVoted[_claimId][msg.sender] = true;
        claim.approvals++;

        if (claim.approvals > memberCount() / 2) {
            executeClaim(_claimId);
        }
    }

    function executeClaim(uint256 _claimId) internal {
        Claim storage claim = claims[_claimId];
        require(!claim.executed, "Already executed");

        claim.executed = true;
        totalPoolBalance -= claim.amount;

        payable(claim.claimant).transfer(claim.amount);
    }
}
