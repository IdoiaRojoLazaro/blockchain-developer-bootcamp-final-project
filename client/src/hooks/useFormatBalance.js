const { utils } = require('ethers');

export const useFormatBalance = balanceValue => {
  return utils.formatEther(balanceValue);
};
