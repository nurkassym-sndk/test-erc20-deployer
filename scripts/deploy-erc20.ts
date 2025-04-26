import { ethers } from 'hardhat';

import * as fs from 'fs';
import * as path from 'path';

import { ERC20__factory } from '../typechain-types';

async function main() {
  const tokenName = process.env.TOKEN_NAME || 'DefaultToken';
  const tokenSymbol = process.env.TOKEN_SYMBOL || 'DTK';
  const tokenDecimals = parseInt(process.env.TOKEN_DECIMALS || '18', 10);

  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);

  const contract = await new ERC20__factory(deployer).deploy(tokenName, tokenSymbol, tokenDecimals);

  const deployTx = contract.deploymentTransaction();

  if (deployTx) {
    console.log('Transaction Hash:', deployTx.hash);
    await deployTx.wait();
  }

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log('Deployed contract address:', address);

  saveDeploymentAddress(address);
}

function saveDeploymentAddress(address: string) {
  const filePath = path.resolve(__dirname, '../deployments/addresses.json');

  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const data = {
    ERC20Token: address,
  };

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Contract address saved to: ${filePath}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
