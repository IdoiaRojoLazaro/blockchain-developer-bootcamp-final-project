var TheLazyCornerContract = artifacts.require('./TheLazyCornerContract.sol');

module.exports = function (deployer) {
  deployer.deploy(TheLazyCornerContract);
};
