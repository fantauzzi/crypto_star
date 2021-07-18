const { expectThrow, expectRevert } = require('@openzeppelin/test-helpers');

const StarNotary = artifacts.require("StarNotary");

var accounts;
var owner;

contract('StarNotary', (accs) => {
    accounts = accs;
    owner = accounts[0];
});

it('can Create a Star', async() => {
    let tokenId = 1;
    let instance = await StarNotary.deployed();
    await instance.createStar('Awesome Star!', tokenId, {from: accounts[0]})
    assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome Star!')
});

it('lets user1 put up their star for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let starId = 2;
    let starPrice = web3.utils.toWei(".01", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    assert.equal(await instance.starsForSale.call(starId), starPrice);
});

it('lets user1 get the funds after the sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 3;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);
    await instance.buyStar(starId, {from: user2, value: balance});
    let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
    let value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
    let value2 = Number(balanceOfUser1AfterTransaction);
    assert.equal(value1, value2);
});

it('lets user2 buy a star, if it is put up for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 4;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    // let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, {from: user2, value: balance});
    assert.equal(await instance.ownerOf.call(starId), user2);
});

it('lets user2 buy a star and decreases its balance in ether', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 5;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    // let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, {from: user2, value: balance, gasPrice:0});
    const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
    let value = Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar);
    assert.equal(value, starPrice);
});

// Implement Task 2 Add supporting unit tests

it('can add the token name and star symbol properly', async() => {
    // 1. The token name and symbol are associated with the deployed contract, no need to create any star in order to fetch them.
    //    Token name and symbol are set at contract deployment time, see file `2_deploy_contracts.js`
    //2. Call the name and symbol properties in your Smart Contract and compare with the name and symbol provided
    let instance = await StarNotary.deployed();
    let name = await instance.name();
    assert.equal(name, 'StarNFT')
    let symbol = await instance.symbol();
    assert.equal(symbol, 'STR')
});

it('lets 2 users exchange stars', async() => {
    let instance = await StarNotary.deployed();
    // 1. create 2 Stars with different tokenId
    user1 = accounts[1]
    user2 = accounts[2]
    starId1 = 9;
    starId2 = 10;
    await instance.createStar('Mazinga', starId1, {from: user1});
    await instance.createStar('Jeeg', starId2, {from: user2});
    let owner_1 = await instance.ownerOf.call(starId1);
    assert.equal(owner_1, user1);
    let owner_2 = await instance.ownerOf.call(starId2);
    assert.equal(owner_2, user2);
    // 2. Call the exchangeStars functions implemented in the Smart Contract
    await instance.exchangeStars(starId1, starId2);
    // 3. Verify that the owners changed
    let new_owner_1 = await instance.ownerOf.call(starId1);
    assert.equal(new_owner_1, user2);
    let new_owner_2 = await instance.ownerOf.call(starId2);
    assert.equal(new_owner_2, user1);


});

it('lets a user transfer a star it owns', async() => {
    let instance = await StarNotary.deployed();
    // 1. create a Star with different tokenId
    user1 = accounts[0]
    user2 = accounts[2]
    starId = 11;
    await instance.createStar('Daitarn', starId, {from: user1});
    let owner_1 = await instance.ownerOf.call(starId);
    assert.equal(owner_1, user1);
    // 2. use the transferStar function implemented in the Smart Contract
    await instance.transferStar(user2, starId);
    // 3. Verify the star owner changed.
    let owner_2 = await instance.ownerOf.call(starId);
    assert.equal(owner_2, user2);
});

it("prevents a user from transferring a star it doesn't own", async() => {
    let instance = await StarNotary.deployed();
    // 1. create a Star with different tokenId
    user1 = accounts[1]
    user2 = accounts[2]
    starId = 12;
    await instance.createStar('Daitarn', starId, {from: user1});
    let owner_1 = await instance.ownerOf.call(starId);
    assert.equal(owner_1, user1);
    // 2. use the transferStar function implemented in the Smart Contract
    await expectRevert(instance.transferStar(user2, starId), "Must be the owner to transfer star");
    // 3. Verify the star owner hasn't changed.
    let owner_2 = await instance.ownerOf.call(starId);
    assert.equal(owner_2, owner_1);
});


it('lets a user fetch the name of a start with a given ID', async() => {
    let instance = await StarNotary.deployed();
    // 1. create a Star with different tokenId
    starId = 6
    let user1 = accounts[1];
    newStarName = 'Goldrake';
    await instance.createStar(newStarName, starId, {from: user1});
    // 2. Call your method lookUptokenIdToStarInfo
    let currentName = await instance.lookUptokenIdToStarInfo(starId);
    // 3. Verify if you Star name is the same
    assert.equal(currentName, newStarName);
});

it('provides and empty string if the user asks for the name of a star with non-existent ID', async() => {
    let instance = await StarNotary.deployed();
    // 1. create a Star with different tokenId
    starId1 = 7
    let user1 = accounts[1];
    newStarName = 'Gundam';
    await instance.createStar(newStarName, starId1, {from: user1});
    // 2. Call your method lookUptokenIdToStarInfo
    starId2 = 8
    let currentName = await instance.lookUptokenIdToStarInfo(starId2);
    // 3. Verify if you Star name is the same
    assert.equal(currentName, '');
});