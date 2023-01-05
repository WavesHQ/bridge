import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ethers } from 'hardhat';

import { BridgeV1, BridgeV1__factory, TestToken } from '../../generated';

export async function deployContracts(): Promise<BridgeDeploymentResult> {
  // Jan 05 2023 8am GMT+0800
  // const unixGmtTime = 1672876800 + (60*60*24);
  const currentUnixTime = Math.floor(Date.now() / 1000) + 86400;
  // const netGmtTime = currentUnixTime - unixGmtTime;
  // if(netGmtTime>(60*60*24)){
  //   console.log(netGmtTime+)
  // }
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

interface BridgeDeploymentResult {
  proxyBridge: BridgeV1;
  testToken: TestToken;
  testToken2: TestToken;
  defaultAdminSigner: SignerWithAddress;
  operationalAdminSigner: SignerWithAddress;
  arbitrarySigner: SignerWithAddress;
}
