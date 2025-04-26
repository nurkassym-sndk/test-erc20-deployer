import { expect } from 'chai';
import { ethers } from 'hardhat';

import 'dotenv/config';

import { ERC20, ERC20__factory } from '../typechain-types';

describe('Token contract', function () {
  let token: ERC20;

  beforeEach(async () => {
    const tokenName = process.env.TOKEN_NAME || 'DefaultToken';
    const tokenSymbol = process.env.TOKEN_SYMBOL || 'DTK';
    const tokenDecimals = parseInt(process.env.TOKEN_DECIMALS || '18', 10);

    const [owner] = await ethers.getSigners();

    token = await new ERC20__factory(owner).deploy(tokenName, tokenSymbol, tokenDecimals);

    await token.waitForDeployment();
  });

  it('Deployment should assign the total supply of tokens to the owner', async function () {
    const [owner] = await ethers.getSigners();
    const ownerBalance = await token.balanceOf(owner.address);

    expect(await token.totalSupply()).to.equal(ownerBalance);
  });

  it('should have correct name', async () => {
    expect(await token.name()).to.equal('NurkassToken');
  });

  it('should have correct symbol', async () => {
    expect(await token.symbol()).to.equal('NUTK');
  });

  it('should have correct decimals', async () => {
    expect(await token.decimals()).to.equal(18);
  });

  it('should have zero total supply after deployment', async () => {
    expect(await token.totalSupply()).to.equal(0);
  });

  it('mint should increase total supply', async () => {
    const [owner] = await ethers.getSigners();

    await token.mint(owner.address, 1000);

    expect(await token.totalSupply()).to.equal(1000);
    expect(await token.balanceOf(owner.address)).to.equal(1000);
  });

  it('should transfer tokens between accounts', async () => {
    const [owner, addr1] = await ethers.getSigners();
    await token.mint(owner.address, 1000);

    await token.transfer(addr1.address, 100);

    expect(await token.balanceOf(owner.address)).to.equal(900);
    expect(await token.balanceOf(addr1.address)).to.equal(100);
  });

  it('should fail if sender does not have enough balance', async () => {
    const [owner, addr1] = await ethers.getSigners();
    await token.mint(owner.address, 100);

    await expect(
      token.connect(addr1).transfer(owner.address, 50)
    ).to.be.revertedWith('ERC20: insufficient balance');
  });

  it('should approve tokens for spending by another account', async () => {
    const [owner, addr1] = await ethers.getSigners();
    await token.mint(owner.address, 1000);

    await token.approve(addr1.address, 100);

    expect(await token.allowance(owner.address, addr1.address)).to.equal(100);
  });

  it('should allow transferFrom by approved spender', async () => {
    const [owner, addr1, addr2] = await ethers.getSigners();

    await token.mint(owner.address, 1000);

    await token.approve(addr1.address, 300);

    await token.connect(addr1).transferFrom(owner.address, addr2.address, 200);

    expect(await token.balanceOf(owner.address)).to.equal(800);
    expect(await token.balanceOf(addr2.address)).to.equal(200);
    expect(await token.allowance(owner.address, addr1.address)).to.equal(100);
  });

  it('should fail if trying to transfer more than allowance', async () => {
    const [owner, addr1, addr2] = await ethers.getSigners();

    await token.mint(owner.address, 1000);
    await token.approve(addr1.address, 200);

    await expect(
      token.connect(addr1).transferFrom(owner.address, addr2.address, 300)
    ).to.be.revertedWithCustomError(token, 'InsufficientAllowance');
  });

  it('should fail to transferFrom if balance is insufficient even if allowance is enough', async () => {
    const [owner, addr1, addr2] = await ethers.getSigners();
    await token.mint(owner.address, 100);
    await token.approve(addr1.address, 200);

     // allowance exceeds the balance
    await expect(
      token.connect(addr1).transferFrom(owner.address, addr2.address, 150)
    ).to.be.reverted;
  });

  it('should burn tokens and reduce total supply', async () => {
    const [owner] = await ethers.getSigners();
    await token.mint(owner.address, 500);

    await token.burn(owner.address, 200);

    expect(await token.balanceOf(owner.address)).to.equal(300);
    expect(await token.totalSupply()).to.equal(300);
  });

  it('should fail to burn more tokens than balance', async () => {
    const [owner] = await ethers.getSigners();
    await token.mint(owner.address, 100);
  
    await expect(token.burn(owner.address, 200)).to.be.reverted;
  });

});
