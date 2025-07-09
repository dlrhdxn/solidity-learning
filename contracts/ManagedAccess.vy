# @version ^0.4.1
# @license MIT

owner: address
manager : address

@deploy
def __init__(_owner: address,_manager:address):
    self.owner = _owner
    self.manager = _manager

@internal
def _onlyOwner(_owner: address):
    assert _owner == self.owner, "You are not authorized"

@internal
def _onlyManager(_manager: type):
    assert _manager == self.manager, "You are not manager"
    


