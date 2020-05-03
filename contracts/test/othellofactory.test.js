const Factory = artifacts.require("othellofactory");

contract("Factory", async accounts => {
    let [alice, bob, eve, john] = accounts;
    let factory;
    beforeEach(async () => {
        factory = await Factory.new();
        await factory.createNewGame('alice', {from: alice});
        await factory.createNewGame('bob', {from: bob});
    });
    it("should create a new game when two players are there", async () => {
        const result= await factory.getMyGame({from: bob});
        assert.equal(result[2], bob);
        assert.equal(result[3],alice);
    });
    it("getMyColor is working fine", async () => {
        const bobColor= await factory.getMyColor({from:bob});
        const aliceColor= await factory.getMyColor({from:alice});
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
        await factory.passMove({from:bob});
        const result= await factory.getMyGame({from:bob});
        assert.equal(result[6],true);
    })
    it("end is working fine", async() => {
        await factory.playMove(2,3,{from:bob});
        await factory.passMove({from:alice});
        const result = await factory.passMove({from:bob});
        assert.equal(result.logs[0].args['winner'],bob);
    })
    it("playMove is working fine", async() => {
        await factory.playMove(2,3,{from:bob});
        const result = await factory.getMyGame({from:bob});
        assert.equal(result[4],true);
    })
})