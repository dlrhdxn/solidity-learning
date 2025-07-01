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

### solidity contract 만들기

- (토큰) 스마트콘트랙트를 만들고 , 배포, 테스트
  -> 배포의 주체는 signers[0] 이 기본값
  -> 그리고 컨트랙트에 연결 돼있는 얘도 처음에 signers[0] 이다.
  -> 즉 컨트랙트에서 호출되는 msg.sender 는 따로 설정안하면 signers[0] 을가리킴

- 코인 네트워크와 토큰의 차이, 수수료는 native token 으로만 지불 가능

(5주차)

- 발행량 정하고 조절하기
  > internal 함수를 활용해 컨트랙트가 배포되는 시점에만 딱 공급량이정해지게 할 수 있음

//contract의 function 등에서 실제 호출하는 tarnsaction msg 객체에 접근가능
// git reset -> commit 되돌리기

- transfer 구현하기

- 단순 데이터를 조회하는건 트랜젝션으로 처리 x

  > MyToken 필드 를 접근할때 transaction 인지 아닌지 구분
  > 배포하거나 transfer 할땐 transaction
  > 왜냐? 비싸니깐 -> state 문은 모든 노드에서 새로 저장해야하므로

- transaction 에서 예외 제어 require

(6주차)

- mocha test refactoring
  beforeEach, await 위치 등등;
