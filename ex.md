### hardhat init

- npm의 --save-dev 옵션이란?

  > 배포환경이아닌 개발환경에서만 패키지를 사용할수있도록 프레임워크등을 설치

- hardhat 기본 설정법

  > npx hardhat init

- git 쓰는법
  > ssh 설정, origin 설정및 업로드
  > master 는 인종차별적발언이여서 black lives matter 운동에 동참하며 main 으로 바뀌었다

---

contracts/my token.sol
ignition/modules/mytoken.ts
test/mytoken.ts
만보면됨

---

### building transactions

- test 에서 mocha 쓰는법

- tx 블럭 생성

- eth 의 wei wei 란무엇인가 -> 단위
  > 부동소수점 연산의 손실을 방지하기위해 굉장히 미세한 단위의 wei 를 씀
  > ex. 연산할때 wei 로 바꾸고 연산한뒤 다시 eth 로 변환

---

### solidity contract 만들기

#### License set

#### initializing

- (토큰) 스마트콘트랙트를 만들고 , 배포, 테스트
  -> 배포의 주체는 signers[0] 이 기본값
  -> 그리고 컨트랙트에 연결 돼있는 얘도 처음에 signers[0] 이다.
  -> 즉 컨트랙트에서 호출되는 msg.sender 는 따로 설정안하면 signers[0] 을가리킴

- 코인 네트워크와 토큰의 차이, 수수료는 native token 으로만 지불 가능

(5주차)

#### minting and supply

- 발행량 정하고 조절하기
  > internal 함수를 활용해 컨트랙트가 배포되는 시점에만 딱 공급량이정해지게 할 수 있음

//토큰개발할떄 contract를 호출한 signer 의 정보를 담은 msg 객체에 접근가능
// git reset -> commit 되돌리기

#### transfer

- transfer 구현하기

- 단순 데이터를 조회하는건 트랜젝션으로 처리 x

  > MyToken 필드 를 접근할때 transaction 인지 아닌지 구분
  > 배포하거나 transfer 할땐 transaction
  > 왜냐? 비싸니깐 -> state 문은 모든 노드에서 새로 저장해야하므로

- transaction 에서 예외 제어 require

(6주차)

- mocha test refactoring
  beforeEach, await 위치 등등;

#### Event

##### tracking, searching blocks

- event 란 무엇인가 > 왜사용할까
  결론 : 그냥 로그를 쓰는 이유와 같다.
  (event 는 로그,기록,토픽을 생성() 을 필터링)

  1.트랜잭션 발생 시 자동으로 emit,생성되는 log(receipt) 기반 추적은 비효율적이다

  기존엔 tx 가 발생하면 내부적으로 emit 을 해주고
  receipt(log)에 full payload 가 담기게되는데,

  블럭들을 대상으로 searching,tracking 관점에서 receipt 가지고 하기엔 너무 비효율적
  따라서 미리 필터링을 해서 중요한 정보들만 인덱싱해놓은 event 를 선언가능

  2.게다가 선언한 event 를 모아 따로 데이터베이스를 꾸려서 더 효율적인 block tracking 가능

  3.search 관점에서 receipt는 종속돼있고 무겁다, event는 가볍고 독립적이다.

  transfer 가 발생할떄마다 event 가 발생하도록해보자

#### 위임 (approve)

#tx

for banking contract

- approve 란
  제 3자(spender)가 내 토큰을 전송하는 권한을 위임

- approve 를 왜쓸까
  스왑 같은걸할때 신뢰가 중요한데, 그걸 거래소(ex DEX) approve를 한뒤 중재해 줘야해
  어떤 행위 중간에 router 를 집어넣어서 banking contract 등에서 신뢰성을보장

- transferFrom(from,to, amount)

  from : from(원래 소유자)
  to : to
  signer : router, spender (간접소유자)

(week 7)

### Tiny Bank

입금, 출금, staking 이 존재하는 은행 contract 만들어보기

#### spec

- 화페(Token) : MyToken
- vault기능
  1. staking
  2. deposit
  3. withdraw
  4. reward (이자 등)

#### reward

interest systme 구현

- reward token : MyToken
- reward resource : 1MT/Block mint
  period ?
  블록체인만 써서 시간을 측정하려면
  블록수 를 통해서만 판단가능
  -> timestamp 를 찍는다해도 블럭끼리 통신이 안됨

- reward distribution : stakedOf[user] / totalStaked \* 1MT/block
  민팅된 1MT 를 유저들끼리 stakedtoken 비율로 나눠가짐

##### reward tx 는 어떻게 처리하는가

-> 매 블럭마다 state 변경 tx 호출하면 비용이 매우매우매우 커짐
-> 효율적이고 정확한 동작을 수행하고 최소한의 tx 를 호출하는 알고리즘 필요
-> 기본원리 : stake 나 withdraw 등을 호출할때 reward tx 자기거만 끼워넣자

(7주차)

##### refactoring reward

- modifier
  : python decorator 랑 기능적으로 같음
  \_ 로 caller 함수를 삽입, 함수 정의 옆에쓰면됨

#### Access control

owner 와 manager 를 정해서 mint() change_RewardPerBlock() 등의 access 를 control
-> abstract contract 문법 이용
