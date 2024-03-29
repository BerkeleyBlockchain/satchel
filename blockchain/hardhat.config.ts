import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "solidity-coverage";

import { resolve } from "path";

import { config as dotenvConfig } from "dotenv";
import { HardhatUserConfig } from "hardhat/config";

dotenvConfig({ path: resolve(__dirname, "./.env") });
import "@tenderly/hardhat-tenderly";


const chainIds = {
  hardhat: 31337,
};

/////////////////////////////////////////////////////////////////
/// Ensure that we have all the environment variables we need.///
/////////////////////////////////////////////////////////////////

// Ensure that we have mnemonic phrase set as an environment variable
const mnemonic: string | undefined = process.env.MNEMONIC;
if (!mnemonic) {
  throw new Error("Please set your MNEMONIC in a .env file");
}
// Ensure that we have archive mainnet node URL set as an environment variable
const archiveMainnetNodeURL: string | undefined =
  process.env.ARCHIVE_MAINNET_NODE_URL;
if (!archiveMainnetNodeURL) {
  throw new Error("Please set your ARCHIVE_MAINNET_NODE_URL in a .env file");
}

const goerliMainnetNodeURL: string | undefined =
  process.env.ARCHIVE_GOERLI_NODE_URL;
if (!goerliMainnetNodeURL) {
  throw new Error("Please set your ARCHIVE_GOERLI_NODE_URL in a .env file");
}

const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY;

////////////////////////////////////////////////////////////
/// HARDHAT NETWORK CONFIGURATION FOR THE FORKED MAINNET ///
////////////////////////////////////////////////////////////
const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      initialBaseFeePerGas: 1_00_000_000,
      gasPrice: "auto",
      accounts: {
        initialIndex: 0,
        count: 20,
        mnemonic,
        path: "m/44'/60'/0'/0",
        accountsBalance: "10000000000000000000000",
      },
      forking: {
        url: archiveMainnetNodeURL,
        blockNumber: 13585669,
      },
      chainId: chainIds.hardhat,
      hardfork: "london",
    },
    goerli: {
      url: goerliMainnetNodeURL,
      accounts: [`0x${GOERLI_PRIVATE_KEY}`],
    },
    // local: {
		// 	url: 'http://127.0.0.1:8545'
	  // }
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  tenderly: {
    username: process.env.username!,
    project: process.env.project!
  },
  solidity: {
    compilers: [
      {
        version: "0.6.12",
        settings: {
          metadata: {
            // Not including the metadata hash
            // https://github.com/paulrberg/solidity-template/issues/31
            bytecodeHash: "none",
          },
          // Disable the optimizer when debugging
          // https://hardhat.org/hardhat-network/#solidity-optimizer-support
          optimizer: {
            enabled: true,
            runs: 800,
          },
        },
      },
      {
        version: "0.8.0",
        settings: {},
      },
    ],
  },
  typechain: {
    outDir: "./contract_types",
    target: "ethers-v5",
  },
};

export default config;
