# @version ^0.4.1
# @license MIT


import ManagedAccess
initializes: ManagedAccess

interface IMyToken:
    def transfer(_amount : uint256, _to :address) : nonpayable
    def transferFrom(_owner : address, _to :address, _amount : uint256) : nonpayable
    def mint(_amount : uint256, _to : address) : nonpayable

event Stake:
    _owner : indexed(address)
    _amount : uint256

event Withdraw:
    _amount: uint256
    _to: indexed(address)

stakedOf : public(HashMap[address,uint256])
totalStaked: public(uint256)

stakingToken: IMyToken

# reward per block
RPB : uint256
INIT_RPB : constant(uint256) = 1 * 10 ** 18
# last Claimed block
LCB : HashMap[address,uint256]
owner : address
manager : address
@external
def __init__(_stakingToken: IMyToken):
    self.stakingToken = _stakingToken
    self.RPB = INIT_RPB
    ManagedAccess.__init__(msg.sender,msg.sender)

@external
def setRPB(_amount: uint256):
    ManagedAccess._onlyOwner(msg.sender)
    self.RPB = _amount
    

@internal
def updateReward(_to : address):
    if self.stakedOf[_to] > 0:
        blocks : uint256 = block.number - self.LCB[_to]
        reward : uint256 = self.RPB * blocks * self.stakedOf[_to] / self.totalStaked
        self.stakingToken.mint(reward,_to)
    self.LCB[_to] = block.number
    


@external
def stake(_amount: uint256):
    assert _amount > 0, "cannot stake 0 amount"
    self.stakingToken.transferFrom(msg.sender, self,_amount)
    self.stakedOf[msg.sender] += _amount
    self.totalStaked += _amount
    log Stake(msg.sender, _amount)
@external
def withdraw(_amount: uint256):
    assert self.stakedOf[msg.sender] >= _amount, "insufficient staked token"
    self.stakingToken.transfer(_amount, msg.sender)
    self.stakedOf[msg.sender] -= _amount
    self.totalStaked -= _amount
    log Withdraw(_amount,msg.sender)
    

    
