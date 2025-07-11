//SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./ManagedAccess.sol";

interface IMyToken {
    function transfer(uint256 amount, address to) external;

    function transferFrom(address from, address to, uint256 amount) external;

    function mint(uint256 amount, address ownder) external;
}

contract TinyBank is ManagedAccess {
    event Stake(address, uint256);
    event Withdraw(uint256, address);

    IMyToken public stakingToken;

    mapping(address => uint256) public lastClaimedBlock;
    //mapping 은 dict 이지만 getkey 가 없음, 해쉬테이블느낌?
    //> key 를 담은 stakeUsers 생성
    // address[] public stakedUsers;
    uint256 defaultRPB = 1e18;
    uint256 rewardPerBlock;

    mapping(address => uint256) public staked;
    uint256 public totalStaked;

    constructor(IMyToken _stakingToken) ManagedAccess(msg.sender, msg.sender) {
        stakingToken = _stakingToken;
        rewardPerBlock = defaultRPB;
    }

    modifier _updateReward(address to) {
        if (staked[to] > 0) {
            uint256 blocks = block.number - lastClaimedBlock[to];
            uint256 reward = (blocks * rewardPerBlock * staked[to]) /
                totalStaked;
            stakingToken.mint(reward, to);
        }
        lastClaimedBlock[to] = block.number;
        _; //caller 함수 부분
    }

    function setRPB(uint256 rpb) external onlyManger {
        rewardPerBlock = rpb;
    }

    function stake(uint256 amount) external _updateReward(msg.sender) {
        require(amount >= 0, "cannot stake amount 0");
        //또 transferFrom 의 호출자 signer는 tinybank
        stakingToken.transferFrom(msg.sender, address(this), amount);
        staked[msg.sender] += amount;
        totalStaked += amount;
        emit Stake(msg.sender, amount);
    }

    function withdraw(uint256 amount) external _updateReward(msg.sender) {
        require(staked[msg.sender] >= amount, "insufficient staked token");
        stakingToken.transfer(amount, msg.sender);
        staked[msg.sender] -= amount;
        totalStaked -= amount;

        emit Withdraw(amount, msg.sender);
    }

    function currentReward(address to) external view returns (uint256) {
        if (staked[to] > 0) {
            uint256 blocks = block.number - lastClaimedBlock[to];
            return (blocks * rewardPerBlock * staked[to]) / totalStaked;
        } else {
            return 0;
        }
    }
}
