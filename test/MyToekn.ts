import hre from "hardhat";
import { MyToken } from "../typechain-types";
import { expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
//또는 mintingamount
const supply = 100;
const decimals = 18;

describe("MyToken deploy test", () => {
  let myTokenC: MyToken;
  let signers: HardhatEthersSigner[];
  beforeEach("should deploy", async () => {
    signers = await hre.ethers.getSigners();
    // deploy 할때 arg 로 sginer address 안주면 signers[0] 과 자동으로 연결
    myTokenC = await hre.ethers.deployContract("MyToken", [
      "MyToken",
      "MT",
      decimals,
      supply,
    ]);
  });

  // describe("Init token", () => {
  // it("make Token", async () => {
  //   expect(await myTokenC.name()).equal("MyToken");
  //   expect(await myTokenC.symbol()).equal("MT");
  //   expect(await myTokenC.decimal()).equal(18);
  // });
  // });

  // describe("Token supply and mint test", () => {
  //   it("", async () => {
  //     // 큰숫자는 Big Int 고려 > 10e18 안됨
  //     expect(await myTokenC.totalSupply()).equal(10n ** 18n);
  //     expect(await myTokenC.balanceOf(signers[0])).equal(10n ** 18n);
  //   });
  // });
  describe("Transfer test", () => {
    it("transfer test", async () => {
      const alice = signers[1];
      await myTokenC.transfer(
        hre.ethers.parseUnits("0.5", decimals),
        alice.address
      );
      console.log(await myTokenC.balanceOf(alice.address));
      expect(await myTokenC.balanceOf(alice.address)).equal(
        hre.ethers.parseUnits("0.5", decimals)
      );
    });

    it("reverted with require test", async () => {
      //reverted 는 트랜젝션은 성공, 가스비를 냈지만 그 코드는 실패함
      const alice = signers[1];
      //await 위치 파악
      await expect(
        myTokenC.transfer(hre.ethers.parseUnits("1.1", decimals), alice.address)
      ).to.be.revertedWith("insufficient balance");
    });
  });
});
