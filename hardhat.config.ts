import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-vyper";
const config: HardhatUserConfig = {
  solidity: "0.8.28",
  vyper: {
    version: "0.4.1",
  },
  networks: {
    // sepolia: {
    //   url:
    //   accounts:
    // }
    kairos: {
      url: "https://public-en-kairos.node.kaia.io",
      accounts: [
        "0xecf78b316ddf42fbeb2d8fc4175a71edede65b0cf877775fa4210121412bdfcf",
      ],
    },
  },
  etherscan: {
    apiKey: {
      kairos: "unnecessary",
    },
    customChains: [
      {
        network: "kairos",
        chainId: 1001,
        urls: {
          apiURL: "https://kairos-api.kaiascan.io/hardhat-verify",
          browserURL: "https://kairos.kaiascan.io",
        },
      },
    ],
  },
};

export default config;

//hh ignition deploy ignition/modules/deploy.ts --network kairos
//hh ignition deploy ignition/modules/deploy.ts --network kairos --reset
//hh verify --network kairos [contract 주소] [params]
//hh verify --network kairos 0x008294F0dC3D217288fcc528FA58a27D62A0b794 MyToken MT 18 100
