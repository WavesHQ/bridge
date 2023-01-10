import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';

export function toWei(amount: string): BigNumber {
  return ethers.utils.parseEther(amount);
}

export function amountAfterFee(amount: BigNumber, transactionFee: BigNumber): BigNumber {
  const feeAmount = amount.mul(transactionFee).div(10000);
  const netAmountAfterFee = amount.sub(feeAmount);
  return netAmountAfterFee;
}

// Current time stamp
export function currentTimeStamp(): number {
  // Current timestamp in seconds
  return Math.floor(Date.now() / 1000);
}
