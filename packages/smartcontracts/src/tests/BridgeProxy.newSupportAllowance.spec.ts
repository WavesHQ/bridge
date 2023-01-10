/* eslint-disable @typescript-eslint/no-unused-vars */
import { loadFixture, time } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

import { TestToken } from '../generated';
import { deployContracts } from './testUtils/deployment';
import { toWei } from './testUtils/mathUtils';

describe('Supported allowance test', () => {
  async function mintAndApprove(token: TestToken, contractAddress: string, eoaAddress: string, mintAmount: string) {
    // Sending appropriate token to user and approved the contract
    await token.approve(contractAddress, ethers.constants.MaxInt256);
    await token.mint(eoaAddress, toWei(mintAmount));
  }
  it('Bridging after a day', async () => {
    const { proxyBridge, testToken, defaultAdminSigner } = await loadFixture(deployContracts);
    // Current timestamp in seconds
    const currentUnixTime = Math.floor(Date.now() / 1000);
    // Seconds in a day
    const dayInUnix = 60 * 60 * 24;
    // Starting supporting token from time
    const allowanceStartTime = currentUnixTime + dayInUnix;
    await mintAndApprove(testToken, proxyBridge.address, defaultAdminSigner.address, '100');
    // adding testToken as supported token with dailyAllowance of 10. Allowance start time would be an currentUnixTime + 1 day.
    await proxyBridge.addSupportedTokens(testToken.address, toWei('10'), allowanceStartTime);
    expect((await proxyBridge.tokenAllowances(testToken.address)).prevEpoch).to.equal(allowanceStartTime);
    await expect(
      proxyBridge.bridgeToDeFiChain(ethers.constants.AddressZero, testToken.address, toWei('10')),
    ).to.revertedWithCustomError(proxyBridge, 'TOKEN_NOT_SUPPORTED_YET');
    // increasing time by 1 day.
    await time.increase(60 * 60 * 24);
    await proxyBridge.bridgeToDeFiChain(ethers.constants.AddressZero, testToken.address, toWei('10'));
  });
  it('Bridging over multiple days', async () => {
    const { proxyBridge, testToken, defaultAdminSigner } = await loadFixture(deployContracts);
    // Current timestamp in seconds
    const currentUnixTime = Math.floor(Date.now() / 1000);
    // Seconds in a day
    const dayInUnix = 60 * 60 * 24;
    // Starting supporting token from time
    const allowanceStartTime = currentUnixTime + dayInUnix;
    await mintAndApprove(testToken, proxyBridge.address, defaultAdminSigner.address, '100');
    // adding testToken as supported token with dailyAllowance of 10. Allowance start time would be an currentUnixTime + 1 day.
    await proxyBridge.addSupportedTokens(testToken.address, toWei('10'), allowanceStartTime);
    // increasing time by 1 day.
    await time.increase(60 * 60 * 24);
    await proxyBridge.bridgeToDeFiChain(ethers.constants.AddressZero, testToken.address, toWei('8'));
    await proxyBridge.bridgeToDeFiChain(ethers.constants.AddressZero, testToken.address, toWei('2'));
    const preAllowance = (await proxyBridge.tokenAllowances(testToken.address)).prevEpoch;
    // Daily allowance set to 10. This tx should fail
    await expect(
      proxyBridge.bridgeToDeFiChain(ethers.constants.AddressZero, testToken.address, toWei('2')),
    ).to.revertedWithCustomError(proxyBridge, 'EXCEEDS_DAILY_ALLOWANCE');
    // increasing time by 2 days.
    await time.increase(60 * 60 * 68);
    await proxyBridge.bridgeToDeFiChain(ethers.constants.AddressZero, testToken.address, toWei('10'));
    await expect(
      proxyBridge.bridgeToDeFiChain(ethers.constants.AddressZero, testToken.address, toWei('2')),
    ).to.revertedWithCustomError(proxyBridge, 'EXCEEDS_DAILY_ALLOWANCE');
    const preAllowance1 = (await proxyBridge.tokenAllowances(testToken.address)).prevEpoch;
    console.log(preAllowance1.sub(preAllowance).div(86400));
    // await time.increase(60 * 60 * 23);
    // await proxyBridge.bridgeToDeFiChain(ethers.constants.AddressZero, testToken.address, toWei('2'));
    // await proxyBridge.bridgeToDeFiChain(ethers.constants.AddressZero, testToken.address, toWei('2'));
  });
});
