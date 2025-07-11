import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
// m 이 블록체인 네트워크 객체 너낌
export default buildModule("MyTokenDeploy", (m) => {
  const myTokenC = m.contract("MyToken", ["MyToken", "MT", 18, 100]);
  const tinyBankC = m.contract("TinyBank", [myTokenC]);
  m.call(myTokenC, "setManager", [tinyBankC]);
  return { myTokenC, tinyBankC };
});

//hh ignition deploy ignition/modules/deploy.ts --network kairos
//hh ignition deploy ignition/modules/deploy.ts --network kairos --reset
//hh verify --network kairos [contract 주소] [params]
//hh verify --network kairos 0x008294F0dC3D217288fcc528FA58a27D62A0b794 MyToken MT 18 100
