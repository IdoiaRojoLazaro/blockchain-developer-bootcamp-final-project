const { utils } = require('ethers');

export const useFormatBalance = balanceValue => {
  return utils.formatEther(balanceValue);
};

export const useFormatPrice = priceValue => {
  return utils.parseEther(priceValue);
};
