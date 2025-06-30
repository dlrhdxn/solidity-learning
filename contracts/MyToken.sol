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
        //amount 는 wei 단위로
        _mint(10 ** uint256(decimal), msg.sender); // msg.sender 는 컨트랙트를 배포하는사람 : 즉, 제작자
    }

    /*
    //아래 나오는 getter function 들은 모두 컴파일시 hardhat이 자동으로만들어줌

    // external 은 외부에서만호출 가능 . view 는 멤버변수 의 읽기만 가능
    // function totalSupply() external view returns (uint256) {
    //     return totalSupply;
    // }

    //string 은 가변길이일때 memory 키워드를 넣어줘야함
    // function name() external view returns (string memory) {
    //     return name;
    // }
*/
    //mint: 주조하다 에서 유래, 즉 새로 토큰을 발행
    // internal function 은 언더바(_) 를 넣는게 국룰
    function _mint(uint256 amount, address owner) internal {
        totalSupply += amount;
        balanceOf[owner] += amount;
    }
}
