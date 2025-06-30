import hre from "hardhat";
import { MyToken } from "../typechain-types";
import { expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("mytoken deploy test", () => {
  let myTokenC: MyToken;
  let signers: HardhatEthersSigner[];
  before("should deploy", async () => {
    signers = await hre.ethers.getSigners();
    myTokenC = await hre.ethers.deployContract("MyToken", [
      "MyToken",
      "MT",
      18,
    ]);
  });
  // it("make Token", async () => {
  //   expect(await myTokenC.name()).equal("MyToken");
  //   expect(await myTokenC.symbol()).equal("MT");
  //   expect(await myTokenC.decimal()).equal(18);
  // });
  it("Token supply", async () => {
    expect(await myTokenC.totalSupply()).equal(0);
    expect(await myTokenC.balanceOf(signers[0])).equal(0);
  });
});
