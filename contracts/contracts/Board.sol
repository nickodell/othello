pragma solidity >=0.5.0 <0.6.0;

// Bit manipulation library
import {Bits128} from "./Bits.sol";

contract Board {
    uint8 constant internal EMPTY = 0;
    uint8 constant internal BLACK = 1;
    uint8 constant internal WHITE = 3;
    uint8 constant internal BOARD_SIZE = 8;
    string[2] playerNames;
    address[2] playerAddresses;
    uint128 gameState;
    using Bits128 for uint128;

    constructor() public {
        initializeBoard();
    }
    function initializeBoard() internal {
        // Clear board
        gameState = 0;
        // set middle tiles
        setTile(3, 3, WHITE);
        setTile(4, 3, BLACK);
        setTile(3, 4, BLACK);
        setTile(4, 4, WHITE);
    }
    function setTile(uint8 x, uint8 y, uint8 value) internal {
        // Is it a valid tile?
        assert(value == EMPTY || value == BLACK || value == WHITE);

        // Is x and y in the range 0 to 7?
        assert(0 <= x && x < BOARD_SIZE);
        assert(0 <= y && y < BOARD_SIZE);
        uint8 flatCoord = x + (8 * y);
        uint8 bitCoord = 2 * flatCoord; 
        gameState = gameState.setBits(bitCoord, 2, value);
    }
    
}
