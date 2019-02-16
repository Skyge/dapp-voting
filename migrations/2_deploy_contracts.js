var Voting = artifacts.require("Ballot");

module.exports = function(deployer) {
  deployer.deploy(Voting, 3);
};
