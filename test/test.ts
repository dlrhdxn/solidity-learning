// import hre, { ethers } from "hardhat";

// describe("hardhat-test", () => {
//   it("hardhat test", async () => {
//     const signers = await hre.ethers.getSigners();
//     // console.log(hre.ethers);
//     // console.log(signers);
//     // console.log(signers.length);

//     const alice = signers[0];
//     const bob = signers[1];

//     const tx = {
//       from: bob.address,
//       to: alice.address,
//       // 1 ETH == 1 * 10^18 wei
//       value: hre.ethers.parseEther("100"), //wei
//     };
//     const txHash = await bob.sendTransaction(tx); // bob 의 서명이필요,but 내부적으로 자동 시행
//     const receipt = await txHash.wait();
//     console.log(await hre.ethers.provider.getTransaction(txHash.hash));
//     console.log("====================");
//     console.log(receipt);
//   });

//   it("ethers test", async () => {
//     const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
//     const bob = new ethers.Wallet(
//       "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
//       provider
//     );
//     const alice = new ethers.Wallet(
//       "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
//     );

//     const tx = {
//       from: bob.address,
//       to: alice.address,
//       value: ethers.parseEther("100"),
//       chainId: 31337,
//     };
//     const populatedTx = await bob.populateTransaction(tx);
//     const signedTx = await bob.signTransaction(populatedTx);
//     const txHash = await provider.send("eth_sendRawTransaction", [signedTx]);
//     console.log(ethers.formatEther(await provider.getBalance(bob.address)));
//     console.log(ethers.formatEther(await provider.getBalance(alice.address)));
//   });
// });
