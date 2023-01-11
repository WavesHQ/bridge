import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';

import { deployContracts } from './testUtils/deployment';
import { currentTimeStamp, toWei } from './testUtils/mathUtils';

describe('Reset allowance time tests', () => {
  describe('Reset Allowance Time tests', () => {
    describe('DEFAULT_ADMIN_ROLE', () => {
      it('Successfully change token`s allowance time', async () => {
        const { proxyBridge, testToken, defaultAdminSigner } = await loadFixture(deployContracts);
        await proxyBridge.addSupportedTokens(testToken.address, toWei('10'), currentTimeStamp());
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
        await proxyBridge.addSupportedTokens(testToken.address, toWei('10'), currentTimeStamp());
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
        await proxyBridge.addSupportedTokens(testToken.address, toWei('10'), currentTimeStamp());
        await expect(
          proxyBridge
            .connect(arbitrarySigner)
            .changeResetAllowanceTime(testToken.address, currentTimeStamp(60 * 60 * 24)),
        ).to.revertedWithCustomError(proxyBridge, 'NON_AUTHORIZED_ADDRESS');
      });
    });
    it('Unable to change NON-SUPPORTED-TOKEN reset allowance time', async () => {
      const { proxyBridge, testToken, defaultAdminSigner } = await loadFixture(deployContracts);
      await expect(
        proxyBridge
          .connect(defaultAdminSigner)
          .changeResetAllowanceTime(testToken.address, currentTimeStamp(60 * 60 * 24)),
      ).to.revertedWithCustomError(proxyBridge, 'TOKEN_NOT_SUPPORTED');
    });
    it('Unable to change reset allowance time to past', async () => {
      const { proxyBridge, testToken, defaultAdminSigner } = await loadFixture(deployContracts);
      // `currentTimePastTwoHrs` current time - 2hrs
      const currentTimePastTwoHrs = currentTimeStamp() - 60 * 60 * 2;
      await expect(
        proxyBridge.connect(defaultAdminSigner).changeResetAllowanceTime(testToken.address, currentTimePastTwoHrs),
      ).to.revertedWithCustomError(proxyBridge, 'INVALID_RESET_EPOCH_TIME');
    });
  });
});
