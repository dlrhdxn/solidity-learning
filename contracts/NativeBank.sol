// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.28;

contract NativeBank {
    mapping(address => uint256) public balanceOf;

    function withdraw() external {
        uint256 balance = balanceOf[msg.sender];
        require(balance > 0, "insufficient balance");

        //[to].call{value:} 하면 이 function 을 호출한 signer 가 to 에게 native 토큰을 전달
        //상대방의 fall back이나 receive가 끝날때까지 기다림
        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "failed to send native token");

        balanceOf[msg.sender] = 0;
    }

    // native token(ether) only function
    receive() external payable {
        balanceOf[msg.sender] += msg.value;
    }
}
