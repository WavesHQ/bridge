/* eslint-disable @typescript-eslint/no-unused-vars */
import { loadFixture, time } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

import { BridgeV1, TestToken } from '../generated';
import { deployContracts } from './testUtils/deployment';
import { currentTimeStamp, toWei } from './testUtils/mathUtils';

describe('Reset allowance time tests', () => {
  async function mintAndApprove(token: TestToken, contractAddress: string, eoaAddress: string, mintAmount: string) {
    // Sending appropriate token to user and approved the contract
    await token.approve(contractAddress, ethers.constants.MaxInt256);
    await token.mint(eoaAddress, toWei(mintAmount));
  }
  describe('Bridging tests', () => {
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
      expect((await proxyBridge.tokenAllowances(testToken.address)).resetEpoch).to.equal(allowanceStartTime);
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
      // Daily allowance set to 10. This tx should fail
      await expect(
        proxyBridge.bridgeToDeFiChain(ethers.constants.AddressZero, testToken.address, toWei('2')),
      ).to.revertedWithCustomError(proxyBridge, 'EXCEEDS_DAILY_ALLOWANCE');
      // increasing time by 3 days.
      await time.increase(60 * 60 * 72);
      await proxyBridge.bridgeToDeFiChain(ethers.constants.AddressZero, testToken.address, toWei('10'));
      await expect(
        proxyBridge.bridgeToDeFiChain(ethers.constants.AddressZero, testToken.address, toWei('2')),
      ).to.revertedWithCustomError(proxyBridge, 'EXCEEDS_DAILY_ALLOWANCE');
      // increasing time by 23 days.
      await time.increase(60 * 60 * 23);
      await expect(
        proxyBridge.bridgeToDeFiChain(ethers.constants.AddressZero, testToken.address, toWei('10')),
      ).to.revertedWithCustomError(proxyBridge, 'EXCEEDS_DAILY_ALLOWANCE');
    });
  });

  describe('Reset Allowance Time tests', () => {
    async function supportedToken(bridge: BridgeV1, tokenAddress: string) {
      await bridge.addSupportedTokens(tokenAddress, toWei('10'), currentTimeStamp());
    }
    describe('DEFAULT_ADMIN_ROLE', () => {
      it('Successfully change token`s allowance time', async () => {
        const { proxyBridge, testToken, defaultAdminSigner } = await loadFixture(deployContracts);
        await supportedToken(proxyBridge, testToken.address);
        const prevEpoch = (await proxyBridge.tokenAllowances(testToken.address)).resetEpoch;
        const newEpoch = currentTimeStamp(60 * 60 * 24);
        await expect(
          proxyBridge
            .connect(defaultAdminSigner)
            .changeResetAllowanceTime(testToken.address, currentTimeStamp(60 * 60 * 24)),
        )
          .to.emit(proxyBridge, 'RESET_EPOCH_BY_OWNER')
          .withArgs(defaultAdminSigner.address, prevEpoch, newEpoch);
      });
    });
    describe('OPERATIONAL_ROLE', () => {
      it('Successfully change token`s allowance time', async () => {
        const { proxyBridge, testToken, operationalAdminSigner } = await loadFixture(deployContracts);
        await supportedToken(proxyBridge, testToken.address);
        const prevEpoch = (await proxyBridge.tokenAllowances(testToken.address)).resetEpoch;
        const newEpoch = currentTimeStamp(60 * 60 * 24);
        await expect(
          proxyBridge
            .connect(operationalAdminSigner)
            .changeResetAllowanceTime(testToken.address, currentTimeStamp(60 * 60 * 24)),
        )
          .to.emit(proxyBridge, 'RESET_EPOCH_BY_OWNER')
          .withArgs(operationalAdminSigner.address, prevEpoch, newEpoch);
      });
    });
    describe('ARBITRARY_EOA', () => {
      it('Unable to change token`s allowance time', async () => {
        const { proxyBridge, testToken, arbitrarySigner } = await loadFixture(deployContracts);
        await supportedToken(proxyBridge, testToken.address);
        const prevEpoch = (await proxyBridge.tokenAllowances(testToken.address)).resetEpoch;
        const newEpoch = currentTimeStamp(60 * 60 * 24);
        await expect(
          proxyBridge
            .connect(arbitrarySigner)
            .changeResetAllowanceTime(testToken.address, currentTimeStamp(60 * 60 * 24)),
        ).to.revertedWithCustomError(proxyBridge, 'NON_AUTHORIZED_ADDRESS');
      });
    });
  });
});
