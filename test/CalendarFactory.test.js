const assert = require('assert');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const ganache = require('ganache-cli');
const Web3 = require('web3');
//const web3 = new Web3(ganache.provider());
const provider = new HDWalletProvider(
    `impact wear banner laundry sell borrow dolphin hen pond burger wagon quit credit example speed naive venue civil village assist gown box tattoo found`,
    "https://rinkeby.infura.io/v3/36d64c099c50404692eb8be07f68db77" // for testing 
    // "https://mainnet.infura.io/v3/36d64c099c50404692eb8be07f68db77"  // for production
);
const web3 = new Web3(provider);

const calendarFactory = require('../ethereum/builds/CalendarFactory.json');
const abi = calendarFactory.abi;
const evm = calendarFactory.evm;

const calendarJson = require('../ethereum/builds/CalendarFactory.json');
const calendarAbi = calendarJson.abi;

let cFactory;
let accounts;
let calendarsAddress;
let calendar;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    cFactory = await new web3.eth.Contract(abi,
        "0xC2d95088E761DaB2Ed34C8Bc668D1267378e61e9"
    );
    calendarsAddress = await cFactory.methods.getCalendars().call({
        from: accounts[0]
    });
    calendar = await new web3.eth.Contract(
        calendarAbi,
        calendarsAddress[0]
    );

});

describe('CalendarFactory Contract', () => {
    it('deploys a factory and calendar contract', () => {
        assert.ok(cFactory.options.address);
        assert.ok(calendar.options.address);
    });
});
