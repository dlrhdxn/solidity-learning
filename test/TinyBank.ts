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
  let bob: HardhatEthersSigner;
  let jack: HardhatEthersSigner;
  let nicole: HardhatEthersSigner;

  beforeEach("should deploy", async () => {
    signers = await hre.ethers.getSigners();
    me = signers[0];
    alice = signers[1];
    bob = signers[2];
    jack = signers[3];
    nicole = signers[4];
    myTokenC = await hre.ethers.deployContract("MyToken", [
      "MyToken",
      "MT",
      decimals,
      supply,
    ]);
    tinyBankC = await hre.ethers.deployContract("TinyBank", [
      await myTokenC.getAddress(),
      [me.address, alice.address, bob.address, jack.address, nicole.address],
    ]);
    await myTokenC.setManager(tinyBankC.getAddress());
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
  describe("reawrd test", () => {
    it("reward 1MT per block when only user is me", async () => {
      const amount = parseUnits("50");
      await myTokenC.approve(tinyBankC.getAddress(), amount);
      await tinyBankC.stake(amount);
      // console.log(await tinyBankC.stakedOf(me.address));

      const BLOCKS = 5;
      const t = parseUnits("1");
      for (var i = 0; i < BLOCKS; i++) {
        await myTokenC.transfer(t, me.address);
      }

      await tinyBankC.withraw(amount);
      // console.log(await myTokenC.balanceOf(me.address));
    });
    it("revert when hacker change his/her RPB", async () => {
      const hacker = signers[3];
      const target_rpb = parseUnits("1000000");
      await expect(
        tinyBankC.connect(hacker).setRPB(target_rpb)
      ).to.be.revertedWith("Not all confirmed yet");
    });
  });
  describe("assignment (onlyAllConfirm test)", () => {
    let target_rpb = parseUnits("10000");
    it("confirm", async () => {
      await expect(tinyBankC.connect(signers[6]).confirm()).revertedWith(
        "You are not a manager"
      );
      for (let i = 0; i < 5; i++) {
        tinyBankC.connect(signers[i]).confirm();
      }
      tinyBankC.setManagers([
        me.address,
        alice.address,
        bob.address,
        jack.address,
        signers[6].address,
      ]);

      await expect(tinyBankC.connect(signers[6]).confirm());
    });
    it("changing RPB with confirm system", async () => {
      await expect(tinyBankC.setRPB(target_rpb)).revertedWith(
        "Not all confirmed yet"
      );
      for (let i = 0; i < 5; i++) {
        tinyBankC.connect(signers[i]).confirm();
      }
      await tinyBankC.setRPB(target_rpb);
    });
  });
});
