const StarNotary = artifacts.require("StarNotary");

module.exports = function(deployer) {
  deployer.deploy(StarNotary, "StarNFT", "STR"); // Provide the wanted token name and symbol
};
