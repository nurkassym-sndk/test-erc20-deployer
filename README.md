# ERC20 Deployer

A simple [Hardhat](https://hardhat.org/) project for deploying a custom [ERC20](https://www.cyfrin.io/glossary/erc-20-solidity-code-example) token to any EVM-compatible network (e.g., Sepolia, Mainnet).

<br/>

## Features
- Deploy ERC20 tokens easily via CLI
- Environment-based configuration (.env)
- Supports multiple networks (local, testnet, mainnet)

## Project requirements

- Node ≥ v18.0.0
- [Hardhat](https://hardhat.org/)
- dotenv

## Installation

```bash
git clone https://github.com/nurkassym-sndk/test-erc20-deployer.git
cd erc20-deployer
npm install
```

## Before start...

- Install all modules using `npm`
- Create `.env` file and complete it with your variables according to `.env.example`

## Project Structure

This repository consists of the following directories:

- `contracts` - utilized for storing smart-contracts written in Solidity as `.sol` files
- `scripts` - contains entry-point files for smart-contract deployment and on-chain interaction, can be augmented with new script files correspondingly
- `test` - contains all modules for smart-contract testing

## Scripts

### Install dependencies

`npm i` or `npm install`

### Compile contracts
```bash
npx hardhat compile
```

### Run tests
```bash
npx hardhat test --network hardhat
```

### **Deployment**
### Localhost (for testing)
```bash
npx hardhat run scripts/deploy-erc20.ts --network localhost
```

### Sepolia Testnet
```bash
npx hardhat run scripts/deploy-erc20.ts --network sepolia
```

### Mainnet
```bash
npx hardhat run scripts/deploy-erc20.ts --network mainnet
```
