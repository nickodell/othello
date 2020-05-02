const Factory = artifacts.require("othellofactory");
const EMPTY = "0";
const BLACK = "1";
const WHITE = "3";

contract("Factory", async accounts => {
    let [alice, bob] = accounts;
    let factory;
    it("should create a new game when two players are there", async () => {
        factory = await Factory.deployed();
        await factory.createNewGame("alice", {from: alice});
        const result= await factory.createNewGame("bob", {from: bob});
        // console.log(result);
        assert.equal(result.logs[0].event, "NewGame");
        assert.equal(result.logs[0].args[0],bob);
        assert.equal(result.logs[0].args[1],alice);
    });
    it("getMyColor is working fine", async () => {
        factory = await Factory.deployed();
        await factory.createNewGame("alice", {from: alice});
        await factory.createNewGame("bob", {from: bob});
        const bobColor= await factory.getMyColor({from:bob});
        const aliceColor= await factory.getMyColor({from:alice});
        console.log(aliceColor);
        assert.equal(aliceColor,"WHITE");
        assert.equal(bobColor,"BLACK");
    });
})