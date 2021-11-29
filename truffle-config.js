require('dotenv').config();
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
        process.env.PRIVATE_KEY_ACCOUNT,
        'https://polygon-mumbai.g.alchemy.com/v2/' +
          process.env.ALCHEMY_KEY_MUMBAI
      ),
      network_id: 80001
    }
  }
};
