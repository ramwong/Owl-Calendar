# A blockchain e-timetable project
## It is now testing, please use Metamask and Rinkeby Test Network
Metamask: https://metamask.io/

Get some coin in test network: https://faucets.chain.link/

## Example
https://ramwong.github.io/Owl-Calendar/

# Run
1. Get npm: https://nodejs.org/en/
2. cd into extracted folder which contains file "package.json"
3. npm install
4. npm run dev
5. browser http://localhost:3000

# If you want to deploy your own
1. update ./ethereum/deploy.js
```
const provider = new HDWalletProvider(
    'REPLACE_WITH_MNEMONIC',
    "https://rinkeby.infura.io/v3/36d64c099c50404692eb8be07f68db77" // for testing 
    // "https://mainnet.infura.io/v3/36d64c099c50404692eb8be07f68db77"  // for production
);
```
2. if you updated the contracts source file (./ethereum/contracts/E-timetable.sol), run 
`npm run compile`
3. `npm run deploy`

# How to use
Use Calendar:
- skip 1-3 if you already had/joined a calendar
- not a must to use with group
1. Click "Manage Calendar"
2. create a new Calendar or join a existing Calendar
3. select joined calednar
4. click on the date you want to add event
5. fill and click create button

Use Group:
- skip 1-3 if you already had/joined a group
1. Click "Manage Group"
2. create a new Group or join a existing Group
3. select joined group
4. Use canledar

# References
UI component:
1. https://react.semantic-ui.com/
2. https://github.com/jquense/react-big-calendar
3. https://www.npmjs.com/package/react-datetime-picker

Github page:
1. https://github.com/gregrickaby/nextjs-github-pages
