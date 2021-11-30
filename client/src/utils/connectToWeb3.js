import Web3 from 'web3';

export const getBalance = async () => {
  const web3 = new Web3(window.ethereum);
  let accounts = await web3.eth.getAccounts();
  let balanceValue = await web3.eth.getBalance(accounts[0]);

  return balanceValue;
};
