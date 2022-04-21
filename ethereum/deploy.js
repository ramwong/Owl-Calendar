const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const path = require("path");
const fs = require("fs-extra");
const calendarFactory = require('./builds/CalendarFactory.json');
const groupFactory = require('./builds/GroupFactory.json');

const buildPath = path.resolve(__dirname, "addresses");

const provider = new HDWalletProvider(
    'REPLACE_WITH_MNEMONIC',
    "https://rinkeby.infura.io/v3/36d64c099c50404692eb8be07f68db77" // for testing 
    // "https://mainnet.infura.io/v3/36d64c099c50404692eb8be07f68db77"  // for production
);

const web3 = new Web3(provider);

fs.ensureDirSync(buildPath);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    let outputs = {};

    console.log('Attempting to deploy from account', accounts[0]);

    let result = await new web3.eth.Contract(calendarFactory.abi)
        .deploy({ data: calendarFactory.evm.bytecode.object })
        .send({ from: accounts[0] });


    outputs["CalendarFactory"] = result.options.address;

    result = await new web3.eth.Contract(groupFactory.abi)
        .deploy({ data: groupFactory.evm.bytecode.object })
        .send({ from: accounts[0] });

    outputs["GroupFactory"] = result.options.address;

    fs.outputJsonSync(
        path.resolve(buildPath, "addresses.json"),
        outputs
    );

    provider.engine.stop();
};
deploy();