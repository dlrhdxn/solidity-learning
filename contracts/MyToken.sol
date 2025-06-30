// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MyToken {
    string public name;
    string public symbol;
    uint8 public decimal; // 1 wei 정의

    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;

    constructor(string memory _name, string memory _symbol, uint8 _decimal) {
        name = _name;
        symbol = _symbol;
        decimal = _decimal;
    }

    //아래 나오는 getter function 들은 모두 컴파일시 hardhat이 자동으로만들어줌

    // external 은 외부에서만호출 가능 . view 는 멤버변수 의 읽기만 가능
    // function totalSupply() external view returns (uint256) {
    //     return totalSupply;
    // }

    //string 은 가변길이일때 memory 키워드를 넣어줘야함
    // function name() external view returns (string memory) {
    //     return name;
    // }
}
