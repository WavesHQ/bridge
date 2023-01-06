import { loadFixture, time } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

import { deployContracts } from './testUtils/deployment';
import { increaseToResetDailyAllowanceTime, toWei } from './testUtils/mathUtils';

describe('Testing new feature', () => {
  it('Bridging token', async () => {
    const { proxyBridge, testToken, defaultAdminSigner } = await loadFixture(deployContracts);
    // Sending appropriate token to user and approved the contract
    await testToken.approve(proxyBridge.address, ethers.constants.MaxInt256);
    await testToken.mint(defaultAdminSigner.address, toWei('100'));
    // adding testToken as supported token with dailyAllowance of 10. Allowance start time would be an day + currentUnixTime.
    await proxyBridge.addSupportedTokens(testToken.address, toWei('12'));
    console.log(await proxyBridge.resetAllowanceTime());
    await proxyBridge.bridgeToDeFiChain(ethers.constants.AddressZero, testToken.address, toWei('8'));
    console.log(await proxyBridge.resetAllowanceTime());
    await proxyBridge.bridgeToDeFiChain(ethers.constants.AddressZero, testToken.address, toWei('2'));
    await proxyBridge.bridgeToDeFiChain(ethers.constants.AddressZero, testToken.address, toWei('2'));
    await expect(
      proxyBridge.bridgeToDeFiChain(ethers.constants.AddressZero, testToken.address, toWei('2')),
    ).to.revertedWithCustomError(proxyBridge, 'EXCEEDS_DAILY_ALLOWANCE');
    // Increasing to reset dailyAllowance for first time
    console.log(await proxyBridge.resetAllowanceTime());
    await time.increase(increaseToResetDailyAllowanceTime(await proxyBridge.resetAllowanceTime()));
    await proxyBridge.bridgeToDeFiChain(ethers.constants.AddressZero, testToken.address, toWei('12'));
    expect((await proxyBridge.tokenAllowances(testToken.address)).currentDailyUsage).to.equal(toWei('12'));
    await expect(
      proxyBridge.bridgeToDeFiChain(ethers.constants.AddressZero, testToken.address, toWei('2')),
    ).to.revertedWithCustomError(proxyBridge, 'EXCEEDS_DAILY_ALLOWANCE');
    console.log(await proxyBridge.resetAllowanceTime());
    // Increasing to reset dailyAllowance for second time
    await time.increase(increaseToResetDailyAllowanceTime(await proxyBridge.resetAllowanceTime()));
    await proxyBridge.bridgeToDeFiChain(ethers.constants.AddressZero, testToken.address, toWei('10'));
    expect((await proxyBridge.tokenAllowances(testToken.address)).currentDailyUsage).to.equal(toWei('10'));
    console.log(await proxyBridge.resetAllowanceTime());
  });
});
