const path = require('path');
const fs = require("fs-extra");
const solc = require('solc');

const buildPath = path.resolve(__dirname, "builds");
fs.removeSync(buildPath);

const eTimetablePath = path.resolve(__dirname, "contracts", "E-timetable.sol");
const source = fs.readFileSync(eTimetablePath, 'utf8');

const input = {
    language: 'Solidity',
    sources: {
        'E-timetable.sol': {
            content: source,
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*'],
            },
        },
    },
};

const contracts = JSON.parse(solc.compile(JSON.stringify(input))).contracts['E-timetable.sol'];

fs.ensureDirSync(buildPath);

for (let contract in contracts) {
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(":", "") + ".json"),
        contracts[contract]
    );
}