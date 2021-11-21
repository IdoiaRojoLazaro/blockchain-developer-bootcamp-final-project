import web3 from './web3';
import NotesMarketContract from './contracts/NotesMarketContract.json';

const address = process.env.REACT_APP_CONTRACT_ADDR;

const abi = NotesMarketContract.abi;

//export default new web3.eth.Contract(abi, address);

const contractInstance = new web3.eth.Contract(abi, address);
const accountsWeb3 = new web3.eth.getAccounts();

export { contractInstance, accountsWeb3 };

// export default new web3.eth.getAccounts();
