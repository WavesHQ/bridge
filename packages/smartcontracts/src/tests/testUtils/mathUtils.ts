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

// This returns the remaining time to reset allowance, depending on current time.
export function increaseToResetDailyAllowanceTime(resetTime: BigNumber): BigNumber {
  const currentTimeUnix = BigNumber.from(Math.floor(Date.now() / 1000));

  if (currentTimeUnix > resetTime) {
    return BigNumber.from(60 * 60 * 24).sub(currentTimeUnix.sub(resetTime));
  }
  return resetTime.sub(currentTimeUnix);
}
