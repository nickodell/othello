const Board = artifacts.require("Board");
const EMPTY = "0";
const BLACK = "1";
const WHITE = "3";

// returns 2D array grouped into groups of size
function unflatten(array, size) {
    const newArray = [];
    while (array.length > 0) {
        newArray.push(array.splice(0, size));
    }
    return newArray
}

contract("Board", async accounts => {
    it("get correct initial state", async () => {
        board = await Board.deployed();
        // gameState = (await board.gameState()).toString();
        // console.log(gameState)
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
    it("can be queried with getTiles", async () => {
        correctBoard = [
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 3, 1, 0, 0, 0],
                [0, 0, 0, 1, 3, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
            ].flat();
        board = await Board.deployed();
        gameState = (await board.getTiles()).toString();
        assert.equal(gameState, correctBoard, "initial game state is incorrect");
    });
    it("tracks player names", async () => {
        board = await Board.deployed();
        player1 = await board.getName(false);
        player2 = await board.getName(true);

        // See 2_deploy_contracts.js for where these values come from
        assert.equal(player1, "Mr. Black");
        assert.equal(player2, "Mr. White");
    });
    it("tracks player addresses", async () => {
        board = await Board.deployed();
        player1 = await board.getAddress(false);
        player2 = await board.getAddress(true);

        // See 2_deploy_contracts.js for where these values come from
        assert.equal(player1, "0x4C56F72016bcc5C8E812aB20374990D126d22945");
        assert.equal(player2, "0xC83AB1F7Ff09662301cA2bee89FA905A36e11F07");
    });
    it("checks valid moves", async () => {
        board = await Board.deployed();
        // You can go next to the white piece...
        isValid = await board.isValidMove(2, 3, false);
        assert.equal(isValid, true);
        // ...but not in the corner
        isValid = await board.isValidMove(0, 0, false);
        assert.equal(isValid, false);
    });
    it("can get all valid moves at once", async () => {
        board = await Board.deployed();
        let F = false;
        let T = true;
        correctValidMoves = [
            [F, F, F, F, F, F, F, F],
            [F, F, F, F, F, F, F, F],
            [F, F, F, T, F, F, F, F],
            [F, F, T, F, F, F, F, F],
            [F, F, F, F, F, T, F, F],
            [F, F, F, F, T, F, F, F],
            [F, F, F, F, F, F, F, F],
            [F, F, F, F, F, F, F, F],
        ];
        let value = await board.getValidMoves();
        let [validMoves, whitesMove] = [value['0'], value['1']]
        validMoves = unflatten(validMoves, 8);
        assert.equal(whitesMove, false);
        assert.deepEqual(correctValidMoves, validMoves);
    });
    // This test takes a really long time.
    // To run it, uncomment it and change Board.setTile to public.

    // it("can have every cell set and read", async () => {
    //     board = await Board.deployed();
    //     // Clear board
    //     for(x = 0; x < 8; x++) {
    //         for(y = 0; y < 8; y++) {
    //             await board.setTile(x, y, 0);
    //             console.log("Setting", x, y);
    //         }
    //     }
    //     // Go to every cell, and check that it can be set without affecting other tiles
    //     for(x = 0; x < 8; x++) {
    //         for(y = 0; y < 8; y++) {
    //             beforeModification = (await board.getTile(x, y)).toString();
    //             assert.equal(beforeModification, EMPTY, "Cell is not empty first");
    //             console.log("cell is empty", x, y);

    //             // Set tile to white
    //             await board.setTile(x, y, 3);
    //             afterModification = (await board.getTile(x, y)).toString();
    //             assert.equal(afterModification, WHITE, "Cell is not white after being set white");
    //             console.log("cell is white", x, y);

    //             // Check that all other cells are empty
    //             for(x2 = 0; x2 < 8; x2++) {
    //                 for(y2 = 0; y2 < 8; y2++) {
    //                     // This is the cell we just set, ignore it
    //                     if(x == x2 && y == y2) continue;
    //                     emptyTile = (await board.getTile(x2, y2)).toString();
    //                     assert.equal(emptyTile, EMPTY, "Setting cell to white changed another cell");
    //                 }
    //             }

    //             // Set tile back to empty
    //             await board.setTile(x, y, 0);
    //         }
    //     }
    // });
});
