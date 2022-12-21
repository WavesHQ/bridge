import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('TestContract', () => {
  describe('#setString', () => {
    it('should correctly modify the contract state', async () => {
      const contract = await (await ethers.getContractFactory('TestContract')).deploy();

      await contract.setString('bridge tanker');
      // Not strictly typed, but should not matter since this is just a sanity test
      const actualResult = await contract.arbitraryString();

      expect(actualResult).to.equal('bridge tanker');
    });
  });
});
