// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.28;

abstract contract MultiManagedAccess {
    uint constant Manager_Numbers = 5;
    address public owner;
    address[Manager_Numbers] public managers;
    bool[Manager_Numbers] public confirmed;

    constructor(address _owner, address[Manager_Numbers] memory _managers) {
        owner = _owner;
        // reference 가 복사가안됌 managers = _managers
        // 따라서 직접 deep copy
        for (uint i = 0; i < Manager_Numbers; i++) {
            managers[i] = _managers[i];
        }
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function allConfirmed() internal view returns (bool) {
        for (uint i = 0; i < Manager_Numbers; i++) {
            if (!confirmed[i]) {
                return false;
            }
        }
        return true;
    }

    function reset() internal {
        for (uint i = 0; i < Manager_Numbers; i++) {
            confirmed[i] = false;
        }
    }

    modifier onlyAllconfirmed() {
        require(allConfirmed(), "Not all confirmed yet");
        reset();
        _;
    }

    function confirm() external {
        bool found = false;
        for (uint i = 0; i < Manager_Numbers; i++) {
            if (managers[i] == msg.sender) {
                found = true;
                confirmed[i] = true;
            }
        }
        require(found, "You are not a manager");
    }

    function setManagers(
        address[Manager_Numbers] memory _managers
    ) external onlyAllconfirmed {
        managers = _managers;
    }
}
