var Board = artifacts.require("Board");
var Factory = artifacts.require("othellofactory");
module.exports = function(deployer) {
	var black = "0x4C56F72016bcc5C8E812aB20374990D126d22945";
	var white = "0xC83AB1F7Ff09662301cA2bee89FA905A36e11F07";
    deployer.deploy(Factory);
    deployer.deploy(Board, true);
    // Additional contracts can be deployed here
};
