const Factory = artifacts.require("othellofactory");

contract("Factory", async accounts => {
    let [alice, bob, eve, john] = accounts;
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
        // factory = await Factory.deployed();
        const bobColor= await factory.getMyColor({from:bob});
        const aliceColor= await factory.getMyColor({from:alice});
        // console.log(aliceColor);
        assert.equal(aliceColor,"WHITE");
        assert.equal(bobColor,"BLACK");
    });
    it("getOpponent is working fine", async()=>{
        const opponent = await factory.getMyOpponent({from:bob});
        assert.equal(opponent,alice);
    })
    it("forfeit is working fine", async()=>{
        const result = await factory.forfeit({from:alice});
        assert.equal(result.logs[0].args[0],bob);
    })
    it("passMove is working fine", async() => {
        await factory.createNewGame("alice", {from: alice});
        await factory.createNewGame("bob", {from: bob});
        await factory.passMove({from:bob});
        const result= await factory.getMyGame({from:bob});
        assert.equal(result[6],true);
    })
    it("end is working fine", async() => {
        await factory.createNewGame("eve", {from: eve});
        await factory.createNewGame("john", {from: john});
        await factory.playMove(2,3,{from:john});
        await factory.passMove({from:eve});
        const result = await factory.passMove({from:john});
        assert.equal(result.logs[0].args['winner'],john);
    })
    it("playMove is working fine", async() => {
        await factory.createNewGame("eve", {from: eve});
        await factory.createNewGame("john", {from: john});
        await factory.playMove(2,3,{from:john});
        const result = await factory.getMyGame({from:eve});
        assert.equal(result[4],true);
    })
})