const Board = artifacts.require("Board");
const EMPTY = "0";
const BLACK = "1";
const WHITE = "3";

contract("Board", async accounts => {
    it("get correct initial state", async () => {
        board = await Board.deployed();
        gameState = (await board.gameState()).toString();
        console.log(gameState)
        firstTile = (await board.getTile(0, 0)).toString();
        assert.equal(firstTile, EMPTY, "value at 0,0 wrong");

        center1 = (await board.getTile(3, 3)).toString();
        center2 = (await board.getTile(4, 3)).toString();
        center3 = (await board.getTile(3, 4)).toString();
        center4 = (await board.getTile(4, 4)).toString();

        assert.equal(center1, WHITE, "value at 3,3 wrong");
        assert.equal(center2, BLACK, "value at 4,3 wrong");
        assert.equal(center3, BLACK, "value at 3,4 wrong");
        assert.equal(center4, WHITE, "value at 4,4 wrong");
    });
});
