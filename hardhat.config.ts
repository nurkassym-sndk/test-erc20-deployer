import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

import 'dotenv/config';

const defaultNetwork = 'localhost';

const config: HardhatUserConfig = {
  defaultNetwork,

  networks: {
    localhost: {
      url: 'http://localhost:8545',
    },
    mainnet: {
      url: `${process.env.MAINNET_PROVIDER}`,
      accounts: [`${process.env.PROD_PRIV_KEY}`],
      // gasPrice: 15000000000,
    },
    sepolia: {
      url: `${process.env.SEPOLIA_PROVIDER}`,
      accounts: [`${process.env.SEPOLIA_PRIV_KEY}`],
    },
  },

  solidity: '0.8.28',
};

export default config;
