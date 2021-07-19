# Crypto Star
**Decentralized Star Notary Service Project** 

A simple Dapp to experiment with Solidity contracts, their automated unit-testing and Web3.

## Rubric Requirements

- ERC-721 Token Name: StarNFT
- ERC-721 Token Symbol: STR
- Truffle v5.4.1 (core: 5.4.1)
- OpenZeppelin v4.2.0
- solc 0.8.6

Note: before deployment to Rinkeby, you need to create a new file named `.secret` in the root of the repo, and write the text of the seed (secret recovery phrase, in Metamask) in it.

## Dependencies

- Truffle v5
- Metamask 9.8
- Node v14

Tested under Ubuntu 20.04

## Installation

- Clone this repo

## Deployment to a Local Blockchain (Ganache)
- Change directory to the root of the repo
- Start `ganache`, then check in its GUI that the Network ID is 1337 and the RPC Server is HTTP://127.0.0.1:8545; if the Network ID or the port (8545) are different, then they need to be updated in file `truffle-config.js`, section `develop`.

```bash
ganache
```

- Connect with `Metamask` to the Ganache blockchain, import at least the first account of those listed in the Ganache GUI
- From a shell, again in the root of the repo, run `truffle` to compile the contracts, migrate them and start the automated unit-tests

```bash
truffle compile
truffle --network develop deploy --reset
truffle --network develop test
```
- Start the rudimentary Web application to invoke the contract; from the root of the repo
```bash
cd app
npm run dev
```
- Go to the link indicated in the output of `npm`, should be [http://localhost:8080/](http://localhost:8080/)

## Deployment to the Rinkeby Test Network via Infura
- In the root of the repo, create a file named `.secret`, containing the seed (secret recovery phrase, in Metamask) that generated the private key to be used for deployment to Rinkeby. **Ensure the related account has enough funds to pay for the deployment**.
- From a shell, again in the root of the repo, run `truffle` to compile the contracts and migrate them.

```bash
truffle compile
truffle --network infura deploy --reset
```

For an example of deployment already done, see the transactions below

[0x56676921dd0b412c379f3dd7f7bf27df5a57b0ec9c54aa4d99e3e864cac0488b](https://rinkeby.etherscan.io/tx/0x56676921dd0b412c379f3dd7f7bf27df5a57b0ec9c54aa4d99e3e864cac0488b)
[0x3931e4cb1f7fa95a1102f4ae4e376d7cfbed0caf9e1af71f138f59ed8d826f21](https://rinkeby.etherscan.io/tx/0x3931e4cb1f7fa95a1102f4ae4e376d7cfbed0caf9e1af71f138f59ed8d826f21)