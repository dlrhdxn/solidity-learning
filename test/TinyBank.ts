import hre from "hardhat";
import { MyToken, TinyBank } from "../typechain-types";
import { expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { decimals, supply } from "./constant";

function parseUnits(num: string) {
  return hre.ethers.parseUnits(num, decimals);
}

describe("TinyBank deploy test", () => {
  let myTokenC: MyToken;
  let tinyBankC: TinyBank;
  let signers: HardhatEthersSigner[];
  let me: HardhatEthersSigner;
  let alice: HardhatEthersSigner;
  beforeEach("should deploy", async () => {
    signers = await hre.ethers.getSigners();
    me = signers[0];
    alice = signers[1];
    myTokenC = await hre.ethers.deployContract("MyToken", [
      "MyToken",
      "MT",
      decimals,
      supply,
    ]);
    tinyBankC = await hre.ethers.deployContract("TinyBank", [
      await myTokenC.getAddress(),
    ]);
  });
  describe("tinybank init and staking test", () => {
    it("total stake", async () => {
      expect(await tinyBankC.totalStaked()).equal(0);
    });
    it("stakedOf init", async () => {
      expect(await tinyBankC.stakedOf(me.address)).equal(0);
    });
    it("stake ledger", async () => {
      await myTokenC.approve(await tinyBankC.getAddress(), parseUnits("50"));
      await expect(tinyBankC.stake(parseUnits("50")))
        .to.emit(tinyBankC, "Stake")
        .withArgs(me.address, parseUnits("50"));
      expect(await tinyBankC.stakedOf(me.address)).equal(parseUnits("50"));
    });
  });
  describe("withdrawl test", () => {
    it("withdraw test", async () => {
      const amount = parseUnits("50");
      await myTokenC.approve(await tinyBankC.getAddress(), amount);
      await tinyBankC.stake(amount);
      expect(await tinyBankC.stakedOf(me)).equal(amount);

      await tinyBankC.withraw(amount);
      expect(await tinyBankC.stakedOf(me)).equal(0);
    });
  });
});
