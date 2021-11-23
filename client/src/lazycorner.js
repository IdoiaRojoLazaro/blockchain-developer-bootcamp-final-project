import Web3 from 'web3';
import NotesMarketContract from './contracts/NotesMarketContract.json';

const address = process.env.REACT_APP_CONTRACT_ADDR;

const abi = NotesMarketContract.abi;

const web3 =
  typeof window.web3 !== 'undefined'
    ? new Web3(window.web3.currentProvider)
    : null;

const contractInstance =
  web3 !== null ? new web3.eth.Contract(abi, address) : null;

export { contractInstance };

// const accountsWeb3 = web3 !== null ? new web3.eth.getAccounts() : null;
// export default new web3.eth.getAccounts();
