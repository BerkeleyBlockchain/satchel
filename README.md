```
$ cd blockchain
$ npm install
```
```
$ cd client
$ npm install
```
```
$ cd blockchain
$ ganache-cli \
  -f https://mainnet.infura.io/v3/e7a8a5b48b5048649a342610dd4e0321 \
  -m "clutch captain shoe salt awake harvest setup primary inmate ugly among become" \
  -i 1 \
  -u 0x9759A6Ac90977b93B58547b4A71c78317f391A28
$ node seed-account-with-erc20/dai.js
$ node compile-smart-contracts.js
$ node deploy-smart-contracts.js
```
replace the address of the smart contract at `client/scr/App.js`->`contractAddr`
```
$ cd client
$ npm run start
```
