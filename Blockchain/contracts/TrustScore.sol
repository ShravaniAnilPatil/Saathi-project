// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TrustScore {
    // Store trust scores for each user
    mapping(address => uint256) public trustScores;
    address public admin;
    
    constructor() {
        admin = msg.sender;
    }
    
    // Only admin can update scores
    
    function updateScore(address user, uint256 score) public {
        require(msg.sender == admin, "Only admin");
        require(score <= 100, "Score must be 0-100");
        trustScores[user] = score;
    }
    
    // Anyone can check a score
    function getScore(address user) public view returns (uint256) {
        return trustScores[user];
    }
}