var NotesMarketContract = artifacts.require('./NotesMarketContract.sol');
const commission = 10;

module.exports = function (deployer) {
  deployer.deploy(NotesMarketContract, commission);
};
