var NotesMarketContract = artifacts.require('./NotesMarketContract.sol');

module.exports = function (deployer) {
  deployer.deploy(NotesMarketContract);
};
