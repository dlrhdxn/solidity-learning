//SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IMyToken {
    function transfer(uint256 amount, address to) external;

    function transferFrom(address from, address to, uint256 amount) external;
}

contract TinyBank {
    event Stake(address, uint256);

    IMyToken public stakingToken;
    mapping(address => uint256) public stakedOf;
    uint256 public totalStaked;

    constructor(IMyToken _stakingToken) {
        stakingToken = _stakingToken;
    }

    function stake(uint256 amount) external {
        require(amount >= 0, "cannot stake amount 0");
        //또 transferFrom 의 호출자 signer는 tinybank
        stakingToken.transferFrom(msg.sender, address(this), amount);
        stakedOf[msg.sender] += amount;
        totalStaked += amount;
        emit Stake(msg.sender, amount);
    }
}
