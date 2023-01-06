import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ethers } from 'hardhat';

import { BridgeV1, BridgeV1__factory, TestToken } from '../../generated';

export async function deployContracts(): Promise<BridgeDeploymentResult> {
  const currentUnixTime = getGmtTime();
  const accounts = await ethers.provider.listAccounts();
  const defaultAdminSigner = await ethers.getSigner(accounts[0]);
  const operationalAdminSigner = await ethers.getSigner(accounts[1]);
  const arbitrarySigner = await ethers.getSigner(accounts[2]);
  const BridgeUpgradeable = await ethers.getContractFactory('BridgeV1');
  const bridgeUpgradeable = await BridgeUpgradeable.deploy();
  await bridgeUpgradeable.deployed();
  const BridgeProxy = await ethers.getContractFactory('BridgeProxy');
  // deployment arguments for the Proxy contract
  const encodedData = BridgeV1__factory.createInterface().encodeFunctionData('initialize', [
    'CAKE_BRIDGE',
    '0.1',
    accounts[0],
    accounts[1],
    accounts[0],
    30,
    currentUnixTime,
  ]);
  const bridgeProxy = await BridgeProxy.deploy(bridgeUpgradeable.address, encodedData);
  await bridgeProxy.deployed();
  const proxyBridge = BridgeUpgradeable.attach(bridgeProxy.address);
  // Deploying ERC20 tokens
  const ERC20 = await ethers.getContractFactory('TestToken');
  const testToken = await ERC20.deploy('Test', 'T');
  const testToken2 = await ERC20.deploy('Test2', 'T2');

  return {
    proxyBridge,
    testToken,
    testToken2,
    defaultAdminSigner,
    operationalAdminSigner,
    arbitrarySigner,
  };
}

// getGmtTime is based current time zone running this.
// If in GMT+8, this returns the 8am for the current day.
function getGmtTime(): number {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();
  // 8am time stamp on current day.
  const timestampFor8am = new Date(year, month, day, 8, 0, 0, 0);
  const uni = Math.floor(timestampFor8am.getTime() / 1000);
  return uni;
}

interface BridgeDeploymentResult {
  proxyBridge: BridgeV1;
  testToken: TestToken;
  testToken2: TestToken;
  defaultAdminSigner: SignerWithAddress;
  operationalAdminSigner: SignerWithAddress;
  arbitrarySigner: SignerWithAddress;
}
