const HDWalletProvider = require('@truffle/hdwallet-provider');
const path = require('path');

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, 'client/src/contracts'),
  compilers: {
    solc: {
      version: '0.8.0'
    }
  },
  networks: {
    develop: {
      host: '127.0.0.1', // Localhost (default: none)
      port: 8545, // Standard Ethereum port (default: none)
      network_id: '*' // Any network (default: none)
    },
    mumbai: {
      provider: new HDWalletProvider(
        '0x9f9082b1b7312ce4b9fc67fe07f42a0fb2bdc61a0bd0c16e1e199d4256d61d9a',
        'https://polygon-mumbai.g.alchemy.com/v2/uMyDopkNBbfUQZqqlWgg8U6AR2J0jxnA'
      ),
      network_id: 80001
    }
  }
};
