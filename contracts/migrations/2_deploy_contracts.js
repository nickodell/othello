var Board = artifacts.require("Board");
module.exports = function(deployer) {
	var black = "0x4C56F72016bcc5C8E812aB20374990D126d22945";
	var white = "0xC83AB1F7Ff09662301cA2bee89FA905A36e11F07";
    deployer.deploy(Board, black, white, "Mr. Black", "Mr. White", true);
    // Additional contracts can be deployed here
};
