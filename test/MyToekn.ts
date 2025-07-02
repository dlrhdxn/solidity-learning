// import hre from "hardhat";
// import { MyToken } from "../typechain-types";
// import { expect } from "chai";
// import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
// import { decimals, supply } from "./constant";
// function parseUnits(num: string) {
//   return hre.ethers.parseUnits(num, decimals);
// }

// describe("MyToken deploy test", () => {
//   let myTokenC: MyToken;
//   let signers: HardhatEthersSigner[];
//   beforeEach("should deploy", async () => {
//     signers = await hre.ethers.getSigners();
//     // deploy 할때 arg 로 sginer address 안주면 signers[0] 과 자동으로 연결
//     myTokenC = await hre.ethers.deployContract("MyToken", [
//       "MyToken",
//       "MT",
//       decimals,
//       supply,
//     ]);
//   });

//   // describe("Init token", () => {
//   // it("make Token", async () => {
//   //   expect(await myTokenC.name()).equal("MyToken");
//   //   expect(await myTokenC.symbol()).equal("MT");
//   //   expect(await myTokenC.decimal()).equal(18);
//   // });
//   // });

//   // describe("Token supply and mint test", () => {
//   //   it("", async () => {
//   //     // 큰숫자는 Big Int 고려 > 10e18 안됨
//   //     expect(await myTokenC.totalSupply()).equal(10n ** 18n);
//   //     expect(await myTokenC.balanceOf(signers[0])).equal(10n ** 18n);
//   //   });
//   // });
//   // describe("Transfer test", () => {
//   //   it("transfer test", async () => {
//   //     const alice = signers[1];
//   //     const tx = await myTokenC.transfer(
//   //       hre.ethers.parseUnits("0.5", decimals),
//   //       alice.address
//   //     );
//   //     const receipt = await tx.wait();
//   //     console.log("\n===receipt logs===\n");
//   //     console.log(receipt?.logs);

//   //     console.log("\n === alice balance === \n");
//   //     console.log(await myTokenC.balanceOf(alice.address));
//   //     expect(await myTokenC.balanceOf(alice.address)).equal(
//   //       hre.ethers.parseUnits("0.5", decimals)
//   //     );
//   //     //Event test
//   //     console.log("\n===Event test====\n");
//   //     const filter = myTokenC.filters.Transfer(signers[0].address);
//   //     const logs = await myTokenC.queryFilter(filter, 0, "latest");
//   //     console.log(logs);

//   //     await expect(
//   //       myTokenC.transfer(hre.ethers.parseUnits("0.5", decimals), alice.address)
//   //     )
//   //       .to.emit(myTokenC, "Transfer")
//   //       .withArgs(
//   //         signers[0].address,
//   //         alice.address,
//   //         hre.ethers.parseUnits("1", decimals)
//   //       );
//   //   });

//   //   it("reverted with require test", async () => {
//   //     //reverted 는 트랜젝션은 성공, 가스비를 냈지만 그 코드는 실패함
//   //     const alice = signers[1];
//   //     //await 위치 파악
//   //     await expect(
//   //       myTokenC.transfer(
//   //         hre.ethers.parseUnits((supply + 1).toString(), decimals),
//   //         alice.address
//   //       )
//   //     ).to.be.revertedWith("insufficient balance");
//   //   });
//   // });
//   describe("Approval function - event test", () => {
//     it("approval test", async () => {
//       const alice = signers[1];
//       await expect(myTokenC.approve(alice, parseUnits("10")))
//         .to.emit(myTokenC, "Approval")
//         .withArgs(alice.address, parseUnits("10"));
//     });
//     it("Transferfrom test", async () => {
//       const alice = signers[1];
//       await expect(
//         myTokenC
//           .connect(alice)
//           .transferFrom(signers[0].address, alice.address, parseUnits("1"))
//       ).to.be.revertedWith("insufficient allowance");
//     });

//     it("assignment", async () => {
//       const alice = signers[1];
//       //1. alice 에게 자산 이동 권한부여
//       await expect(myTokenC.approve(alice, parseUnits("10")))
//         .to.emit(myTokenC, "Approval")
//         .withArgs(alice.address, parseUnits("10"));
//       //2. alice 가 signers[0] 에서 alice 에게 자산이동 시전
//       await expect(
//         myTokenC
//           .connect(alice)
//           .transferFrom(signers[0].address, alice.address, parseUnits("10"))
//       )
//         .to.emit(myTokenC, "Transfer")
//         .withArgs(signers[0].address, alice.address, parseUnits("10"));
//       //3. 자산이동 확인
//       expect(await myTokenC.balanceOf(alice.address)).equal(parseUnits("10"));
//     });
//   });
// });
