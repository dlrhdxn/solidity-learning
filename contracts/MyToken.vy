# @version ^0.3.0
# @license MIT
#var : type

event Transfer:
    owner : indexed(address)
    to : indexed(address)
    amount : uint256

event Approval:
    spender: indexed(address)
    amount: uint256
owner : address
manager : address
name : public(String[64])
symbol : public(String[32])
decimals : public(uint256)
totalSupply : public(uint256)

balanceOf : public(HashMap[address, uint256])   
allowances : public(HashMap[address, HashMap[address, uint256]])
 
@external
def __init__(_name: String[64], _symbol: String[32], _decimals : uint256,_initialSupply : uint256):
    self.name = _name
    self.symbol = _symbol
    self.decimals = _decimals
    self.totalSupply = _initialSupply * 10 ** _decimals
    self.balanceOf[msg.sender] += _initialSupply * 10 ** _decimals
    self.owner = msg.sender
    self.manager = msg.sender


# internal 함수는 msg 객체 못씀
# 먼저 정의해줘야함
@internal
def isOwner(_address : address):
    assert self.owner == _address, "You are not authorized"

@internal
def isManager(_address : address):
    assert self.manager == _address, "You are not manager"
    
    
@external
def transfer(_amount : uint256, _to : address):
    assert self.balanceOf[msg.sender] >= _amount, "insufficient balance"
    self.balanceOf[msg.sender] -= _amount
    self.balanceOf[_to] += _amount

    log Transfer(msg.sender, _to , _amount)
    

@external
def approve(_spender : address , _amount:uint256):
    self.allowances[msg.sender][_spender] += _amount
    log Approval(_spender, _amount)

@external
def transferFrom(_owner: address,_to : address, _amount:uint256):
    assert self.allowances[_owner][msg.sender] >= _amount, "insufficient allowance"
    assert self.balanceOf[_owner] >= _amount , "insufficient balance"
    self.balanceOf[_owner] -= _amount
    self.balanceOf[_to] += _amount
    self.allowances[_owner][msg.sender] -= _amount

    log Transfer(_owner, _to , _amount)

@internal
def _mint(_amount: uint256 , _to : address):
    self.balanceOf[_to] += _amount
    self.totalSupply += _amount 

    log Transfer(ZERO_ADDRESS, _to , _amount)

@external
def mint(_amount: uint256 , _to : address):
    self.isManager(msg.sender)
    self._mint(_amount,_to)
    
@external
def setManager(_manager: address):
    self.isOwner(msg.sender)
    self.manager = _manager
    


    
