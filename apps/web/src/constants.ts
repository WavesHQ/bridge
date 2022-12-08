interface TooltipInfoI {
  title: string;
  content: string;
}

export const CONSORTIUM_INFO: TooltipInfoI = {
  title: "DeFiChain Consortium",
  content:
    "DeFiChain members that have been given the rights to mint and burn the Tokenized Assets on DeFiChain.",
};

export const FEES_INFO: TooltipInfoI = {
  title: "Fees",
  content:
    "Fees to cover the cost of transactions on DeFiChain and Ethereum networks. For more information, visit our user guide.",
};

export const TOKEN_SUPPLY_INFO: TooltipInfoI = {
  title: "Token Supply",
  content:
    "Token supply indicates the amount of liquidity currently available for a particular token pair on DeFiChain Bridge",
};

export const DAILY_LIMIT_INFO: TooltipInfoI = {
  title: "Daily Limit",
  content:
    "DeFiChain Bridge has a daily hard cap for each token pair. Once this limit is reached, you will not be able to transfer to DeFiChain or Ethereum until the next day.",
};
