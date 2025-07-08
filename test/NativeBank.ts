import hre, { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { NativeBank } from "../typechain-types";
import { expect } from "chai";
import { decimals } from "./constant";
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
  const uintParser = (amount: string) =>
    hre.ethers.parseUnits(amount, decimals);
  const unitFormatter = (amount: bigint) =>
    hre.ethers.formatUnits(amount, decimals);
  const getBalance = async (address: string) =>
    unitFormatter(await hre.ethers.provider.getBalance(address));
  it("exploit", async () => {
    const victim = signers[1];
    const victim2 = signers[2];
    const hacker = signers[3];
    const exploitC = await hre.ethers.deployContract(
      "Exploit",
      [await nativeBankC.getAddress()],
      hacker
    );
    const hCaddr = await exploitC.getAddress();
    const amount = uintParser("1");
    const v1tx = {
      from: victim,
      to: await nativeBankC.getAddress(),
      value: amount,
    };

    const v2tx = {
      from: victim2,
      to: await nativeBankC.getAddress(),
      value: amount,
    };

    await victim.sendTransaction(v1tx);
    await victim2.sendTransaction(v2tx);

    console.log(await getBalance(hCaddr));
    //contract 의 함수를 호출하는 transaction 을 할때, function({}, arg)로 기본 필드들의 값을 정해줄 수 있음
    await exploitC.exploit({ value: amount });

    //총 3개
    console.log(await getBalance(hCaddr));
  });
});
