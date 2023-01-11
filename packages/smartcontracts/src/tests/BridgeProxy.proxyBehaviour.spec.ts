import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

import { BridgeV1 } from '../generated';
import { BridgeDeploymentResult, deployContracts } from './testUtils/deployment';

describe('Test Behaviour related to proxy', () => {
  describe('Test Proxy Upgradeability', () => {
    it('The smart contract retains the values of state variables after upgrading', async () => {
      let blockNum: Number = await ethers.provider.getBlockNumber();
      console.log('before ', blockNum);
      const { testToken, proxyBridge, defaultAdminSigner } = await loadFixture(deployContracts);
      blockNum = await ethers.provider.getBlockNumber();
      console.log('after: ', blockNum);
      const accounts = await ethers.provider.listAccounts();

      const NewImplementation = await ethers.getContractFactory('NewImplementation');
      const newImplementation = await NewImplementation.deploy();
      await newImplementation.deployed();

      let tx = await testToken.mint(proxyBridge.address, 100);
      await tx.wait();
      tx = await proxyBridge.addSupportedTokens(testToken.address, 15);
      await tx.wait();
      const eip712Types = {
        CLAIM: [
          { name: 'to', type: 'address' },
          { name: 'amount', type: 'uint256' },
          { name: 'nonce', type: 'uint256' },
          { name: 'deadline', type: 'uint256' },
          { name: 'tokenAddress', type: 'address' },
        ],
      };
      const domainData = {
        name: 'CAKE_BRIDGE',
        version: '0.1',
        chainId: 1337,
        verifyingContract: proxyBridge.address,
      };
      const eip712Data = {
        to: accounts[2],
        amount: 10,
        nonce: 0,
        deadline: ethers.constants.MaxUint256,
        tokenAddress: testToken.address,
      };

      const signature = await defaultAdminSigner._signTypedData(domainData, eip712Types, eip712Data);
      tx = await proxyBridge.claimFund(accounts[2], 10, 0, ethers.constants.MaxUint256, testToken.address, signature);
      await tx.wait();

      // upgrade to the new contract
      tx = await proxyBridge.upgradeTo(newImplementation.address);
      await tx.wait();
      // check the implementation slot
      expect(
        `0x${(
          await ethers.provider.getStorageAt(
            proxyBridge.address,
            '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc',
          )
        ).substring(26)}`,
      ).to.equal(newImplementation.address.toLowerCase());
      // check admin role and other storage slots
      expect(
        await proxyBridge.hasRole(
          '0x0000000000000000000000000000000000000000000000000000000000000000',
          defaultAdminSigner.address,
        ),
      ).to.equal(true);
      expect(await proxyBridge.eoaAddressToNonce(accounts[2])).to.equal(1);
      expect(await proxyBridge.supportedTokens(testToken.address)).to.equal(true);
      expect(await proxyBridge.relayerAddress()).to.equal(defaultAdminSigner.address);
      expect((await proxyBridge.tokenAllowances(testToken.address)).dailyAllowance).to.equal(15);
      expect(await proxyBridge.transactionFee()).to.equal(30);
    });
  });

  describe('Test different situations of calling the proxy contract', () => {
    let abiCoder: any;
    let proxyBridge: BridgeV1;
    let defaultAdminSigner: SignerWithAddress;

    beforeEach(async () => {
      abiCoder = new ethers.utils.AbiCoder();
      const bridgeDeploymentResult: BridgeDeploymentResult = await loadFixture(deployContracts);
      proxyBridge = bridgeDeploymentResult.proxyBridge;
      defaultAdminSigner = bridgeDeploymentResult.defaultAdminSigner;
    });

    it('Send no data and send some ether to the smart contract', async () => {
      const prevETHBalance = await ethers.provider.getBalance(proxyBridge.address);
      const tx = await defaultAdminSigner.sendTransaction({
        to: proxyBridge.address,
        data: '0x',
        value: ethers.utils.parseEther('1.0'),
      });
      const receipt = await tx.wait();
      // check the event emitted
      expect(receipt.logs[0].address).to.equal(proxyBridge.address);
      expect(receipt.logs[0].topics[0]).to.equal(
        ethers.utils.keccak256(ethers.utils.toUtf8Bytes('ETH_RECEIVED(address,uint256)')),
      );
      expect(receipt.logs[0].topics[1]).to.equal(abiCoder.encode(['address'], [defaultAdminSigner.address]));
      expect(receipt.logs[0].topics[2]).to.equal(abiCoder.encode(['uint256'], [ethers.utils.parseEther('1')]));
      const afterETHBalance = await ethers.provider.getBalance(proxyBridge.address);
      expect(afterETHBalance.sub(prevETHBalance)).to.equal(ethers.utils.parseEther('1.0'));
    });

    it('Call a method that is not in the implementation interface', async () => {
      const TestTokenFactory = await ethers.getContractFactory('TestToken');
      const attachedToken = TestTokenFactory.attach(proxyBridge.address);
      await expect(attachedToken.totalSupply()).to.reverted;
    });

    it('Call a method that is in the implementation interface that is not payable, without sending ether', async () => {
      await defaultAdminSigner.sendTransaction({
        to: proxyBridge.address,
        data:
          ethers.utils.keccak256(ethers.utils.toUtf8Bytes('addSupportedTokens(address,uint256)')).substring(0, 10) +
          abiCoder.encode(['address', 'uint256'], [ethers.constants.AddressZero, 10]).substring(2),
      });
      expect(await proxyBridge.supportedTokens(ethers.constants.AddressZero)).to.equal(true);
    });

    it('Call a method that is in the implementation interface that is not payable, and send ether', async () => {
      await expect(
        defaultAdminSigner.sendTransaction({
          to: proxyBridge.address,
          data:
            ethers.utils.keccak256(ethers.utils.toUtf8Bytes('addSupportedTokens(address,uint256)')).substring(0, 10) +
            abiCoder.encode(['address', 'uint256'], [ethers.constants.AddressZero, 10]).substring(2),
          value: 100,
        }),
      ).to.reverted;
    });

    it('Call a method that is in the implementation interface that is payable, and send ether', async () => {
      const tx = await proxyBridge.addSupportedTokens(ethers.constants.AddressZero, 15);
      await tx.wait();
      await expect(
        proxyBridge.bridgeToDeFiChain(ethers.constants.AddressZero, ethers.constants.AddressZero, 0, { value: 10 }),
      ).to.emit(proxyBridge, 'BRIDGE_TO_DEFI_CHAIN');
    });

    it('Call a method that is in the implementation interface that is payable, without sending any ether', async () => {
      const tx = await proxyBridge.addSupportedTokens(ethers.constants.AddressZero, 15);
      await tx.wait();
      await expect(
        proxyBridge.bridgeToDeFiChain(ethers.constants.AddressZero, ethers.constants.AddressZero, 0),
      ).to.emit(proxyBridge, 'BRIDGE_TO_DEFI_CHAIN');
    });
  });
});
