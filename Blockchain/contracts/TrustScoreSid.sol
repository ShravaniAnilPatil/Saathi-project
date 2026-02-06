// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TrustScoreSid {
    struct User {
        uint256 score;
        uint256 totalLoans;
        uint256 defaults;
        bool exists;
    }

    mapping(address => User) public users;

    uint256 public constant BASE_SCORE = 500;
    uint256 public constant MAX_SCORE = 900;

    event UserInitialized(address user);
    event TrustScoreUpdated(address user, uint256 newScore);

    function initUser(address _user) external {
        require(!users[_user].exists, "User already exists");

        users[_user] = User({
            score: BASE_SCORE,
            totalLoans: 0,
            defaults: 0,
            exists: true
        });

        emit UserInitialized(_user);
    }

    function recordSuccessfulLoan(address _user) external {
        require(users[_user].exists, "User not initialized");

        users[_user].totalLoans += 1;

        users[_user].score += 10;
        if (users[_user].score > MAX_SCORE) {
            users[_user].score = MAX_SCORE;
        }

        emit TrustScoreUpdated(_user, users[_user].score);
    }

    function recordDefault(address _user) external {
        require(users[_user].exists, "User not initialized");

        users[_user].defaults += 1;

        if (users[_user].score > 50) {
            users[_user].score -= 50;
        } else {
            users[_user].score = 0;
        }

        emit TrustScoreUpdated(_user, users[_user].score);
    }

    function getTrustScore(address _user) external view returns (uint256) {
        return users[_user].score;
    }

    function recoverTrust(address _user) external {
    require(users[_user].exists, "User not initialized");
    require(users[_user].score < BASE_SCORE, "No recovery needed");

    users[_user].score += 20;
    if (users[_user].score > BASE_SCORE) {
        users[_user].score = BASE_SCORE;
    }

    emit TrustScoreUpdated(_user, users[_user].score);
}

function applyLatePenalty(address _user) external {
    require(users[_user].exists, "User not initialized");

    if (users[_user].score > 15) {
        users[_user].score -= 15;
    } else {
        users[_user].score = 0;
    }

    emit TrustScoreUpdated(_user, users[_user].score);
}

}
