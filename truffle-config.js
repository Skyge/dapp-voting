require('dotenv').config()
var HDWalletProvider = require("truffle-hdwallet-provider"); 
var infura_apikey = process.env.INFURA_APIKEY;
var mnemonic = process.env.MNEMONIC; 

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*" // Match any network id
    },
    kovan: {
      provider: new HDWalletProvider(mnemonic, "https://kovan.infura.io/"+infura_apikey),
      network_id: 42,
      gas: 3012388,
      gasPrice: 30000000000
    },
    ropsten: {
      provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/"+infura_apikey),
      network_id: 3,
      gas: 3012388,
      gasPrice: 30000000000
    },
    main: {
      provider: new HDWalletProvider(mnemonic, "https://mainnet.infura.io/"+infura_apikey),
      network_id: 1,
      gas: 3012388,
      gasPrice: 1000000000
    }
  }
};
