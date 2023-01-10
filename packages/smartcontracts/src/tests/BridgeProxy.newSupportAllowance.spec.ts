/* eslint-disable @typescript-eslint/no-unused-vars */
import { loadFixture, time } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

import { deployContracts } from './testUtils/deployment';
import { toWei } from './testUtils/mathUtils';

describe('Supported allowance test', () => {
  it('Testing new allowance', async () => {
    const { proxyBridge, testToken, defaultAdminSigner } = await loadFixture(deployContracts);
    // Current timestamp in seconds
    const currentUnixTime = Math.floor(Date.now() / 1000);
    // Second in a day
    const dayInUnix = 60 * 60 * 24;
    // Starting supporting token from time
    const allowanceStartTime = currentUnixTime + dayInUnix;
    // Sending appropriate token to user and approved the contract
    await testToken.approve(proxyBridge.address, ethers.constants.MaxInt256);
    await testToken.mint(defaultAdminSigner.address, toWei('100'));
    // adding testToken as supported token with dailyAllowance of 10. Allowance start time would be an day + currentUnixTime.
    await proxyBridge.addSupportedTokens(testToken.address, toWei('10'), allowanceStartTime);
    expect((await proxyBridge.tokenAllowances(testToken.address)).startingAllowanceTime).to.equal(allowanceStartTime);
    await expect(
      proxyBridge.bridgeToDeFiChain(ethers.constants.AddressZero, testToken.address, toWei('10')),
    ).to.revertedWithCustomError(proxyBridge, 'TOKEN_NOT_SUPPORTED_YET');
    await time.increase(60 * 60 * 24);
    await proxyBridge.bridgeToDeFiChain(ethers.constants.AddressZero, testToken.address, toWei('10'));
  });
});
