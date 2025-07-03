//SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IMyToken {
    function transfer(uint256 amount, address to) external;

    function transferFrom(address from, address to, uint256 amount) external;

    function mint(uint256 amount, address ownder) external;
}

contract TinyBank {
    event Stake(address, uint256);
    event Withdraw(uint256, address);

    IMyToken public stakingToken;

    mapping(address => uint256) public lastClaimedBlock;
    //mapping 은 dict 이지만 getkey 가 없음, 해쉬테이블느낌?
    //> key 를 담은 stakeUsers 생성
    // address[] public stakedUsers;
    uint256 rewardPerBlock = 10e18;

    mapping(address => uint256) public stakedOf;
    uint256 public totalStaked;

    constructor(IMyToken _stakingToken) {
        stakingToken = _stakingToken;
    }

    function distributeReward(address to) internal {
        uint256 blocks = block.number - lastClaimedBlock[to];
        uint256 reward = (blocks * rewardPerBlock * stakedOf[to]) / totalStaked;
        stakingToken.mint(reward, to);
        lastClaimedBlock[to] = block.number;
    }

    function stake(uint256 amount) external {
        require(amount >= 0, "cannot stake amount 0");
        distributeReward(msg.sender);
        //또 transferFrom 의 호출자 signer는 tinybank
        stakingToken.transferFrom(msg.sender, address(this), amount);
        stakedOf[msg.sender] += amount;
        totalStaked += amount;
        emit Stake(msg.sender, amount);
    }

    function withraw(uint256 amount) external {
        require(stakedOf[msg.sender] >= amount, "insufficient staked token");
        distributeReward(msg.sender);
        stakingToken.transfer(amount, msg.sender);
        stakedOf[msg.sender] -= amount;
        totalStaked -= amount;

        emit Withdraw(amount, msg.sender);
    }
}
