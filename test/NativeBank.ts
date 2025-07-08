import hre, { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { NativeBank } from "../typechain-types";
import { expect } from "chai";
describe("NativeBank", () => {
  let signers: HardhatEthersSigner[];
  let nativeBankC: NativeBank;
  beforeEach("Deploy", async () => {
    signers = await hre.ethers.getSigners();
    nativeBankC = await hre.ethers.deployContract("NativeBank");
  });
  it("contract", async () => {
    const signers = await hre.ethers.getSigners();
    const staker = signers[0];

    const tx = {
      from: staker.address,
      to: await nativeBankC.getAddress(),
      value: hre.ethers.parseEther("1"),
    };
    const txresp = staker.sendTransaction(tx);
    const recipt = (await txresp).wait();
    console.log(
      await hre.ethers.provider.getBalance(await nativeBankC.getAddress())
    );
  });

  it("withdraw", async () => {
    const staker = signers[0];
    const amount = hre.ethers.parseEther("10");
    const tx = {
      from: staker,
      to: await nativeBankC.getAddress(),
      value: amount,
    };
    const txresp = await staker.sendTransaction(tx);
    txresp.wait();

    expect(await nativeBankC.balanceOf(staker.address)).to.equal(amount);
    await nativeBankC.withdraw();
    expect(await nativeBankC.balanceOf(staker.address)).to.equal(0);
  });
});
