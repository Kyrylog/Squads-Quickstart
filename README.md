For refernce: https://docs.squads.so/main/v/development/introduction/quickstart

0. set package.json with: "@sqds/multisig": "^2.1.0". And tsconfig with: "target": "ES2022"
1. npm install (to install all the needed npm packages for sol/web3 to work)
2. install Solana CLI from official solanalabs: https://docs.solanalabs.com/cli/install
3. check versioning of solana with: solana --version (to be sure it's installed)
4. run solana validator with: solana-test-validator (to be able to perform airdrop)
5. set test script in package.json: "test": "ts-mocha -p tsconfig.json --timeout 20000 main.ts"
6. input such command from the project dir: npm run test