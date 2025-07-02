// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MyToken {
    event Transfer(address indexed from, address indexed to, uint256 amount);
    event Approval(address indexed spender, uint256 amount);

    string public name;
    string public symbol;
    uint8 public decimal; // 1 wei 정의

    //데이터조회는 tx 로 처리할필요 x
    //state
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimal,
        uint256 _amount
    ) {
        name = _name;
        symbol = _symbol;
        decimal = _decimal;
        //amount 는 wei 단위로, 메모리상에서 저장을 uint256 으로 하기에 형변환 맘껏해도상관x
        _mint(_amount * 10 ** uint256(decimal), msg.sender); // msg.sender 는 컨트랙트를 배포하는사람 : 즉, 제작자
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

        emit Transfer(address(0), owner, amount);
    }

    function transfer(uint256 amount, address to) external {
        require(balanceOf[msg.sender] >= amount, "insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;

        emit Transfer(msg.sender, to, amount);
    }

    function approve(address spender, uint256 amount) external {
        allowance[msg.sender][spender] = amount;
        emit Approval(spender, amount);
    }

    function transferFrom(address from, address to, uint256 amount) external {
        address spender = msg.sender;
        require(allowance[from][spender] >= amount, "insufficient allowance");
        allowance[from][spender] -= amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;

        emit Transfer(from, to, amount);
    }
}
