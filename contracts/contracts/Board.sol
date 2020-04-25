pragma solidity >=0.5.0 <0.6.0;

// Bit manipulation library
import {Bits128} from "./Bits.sol";

contract Board {
    uint8 constant internal EMPTY = 0;
    uint8 constant internal BLACK = 1;
    uint8 constant internal WHITE = 3;
    uint8 constant internal BOARD_SIZE = 8;
    uint8 constant internal BITS_PER_CELL = 2;
    // Also equal to BOARD_SIZE * BOARD_SIZE * BITS_PER_CELL
    uint8 constant internal BITFIELD_SIZE = 128;
    string[2] playerNames;
    address[2] playerAddresses;
    uint128 public gameState;
    bool whitesMove;
    using Bits128 for uint128;

    constructor(address blackPlayer, address whitePlayer, string memory blackName, string memory whiteName) public {
        initializeBoard();
        whitesMove = false;
        playerAddresses[0] = blackPlayer;
        playerAddresses[1] = whitePlayer;
        playerNames[0] = blackName;
        playerNames[1] = whiteName;
    }
    function initializeBoard() internal {
        // Clear board
        gameState = 0;
        // Set middle tiles
        setTile(3, 3, WHITE);
        setTile(4, 3, BLACK);
        setTile(3, 4, BLACK);
        setTile(4, 4, WHITE);
    }
    function getBitfieldCoordinate(uint8 x, uint8 y) internal pure returns (uint8 bitCoord) {
        // Is x and y in the range 0 to 7?
        assert(0 <= x && x < BOARD_SIZE);
        assert(0 <= y && y < BOARD_SIZE);

        // We need to take a 2-dimensional coordinate and change it into a 1-dimensional coordinate.
        // To do this, we decide that all cells with the same y value will be next to each other,
        // followed by the cells with the next y value. If you use x to represent the column number, and
        // use y to represent the row number, then the cells are stored in the same order as you would
        // read them in a book, reading right-to-left and top-to-bottom.

        // Here's a diagram: https://docs.unity3d.com/StaticFiles/ScriptRefImages/RectXY.svg
        uint8 flatCoord = x + (BOARD_SIZE * y);
        bitCoord = BITS_PER_CELL * flatCoord;
        return bitCoord;
    }
    function setTile(uint8 x, uint8 y, uint8 value) internal {
        // Is it a valid tile?
        assert(value == EMPTY || value == BLACK || value == WHITE);
        uint8 bitCoord = getBitfieldCoordinate(x, y);
        gameState = gameState.setBits(bitCoord, BITS_PER_CELL, value);
    }
    function getTile(uint8 x, uint8 y) public view returns (uint8 value) {
        uint8 bitCoord = getBitfieldCoordinate(x, y);
        return uint8(gameState.bits(bitCoord, BITS_PER_CELL));
    }
    function getTiles() public view returns (uint8[64] memory board) {
        // Return array of board values, 1 per space
        uint8 flatCoord = 0;
        for(uint8 bitCoord = 0; bitCoord < BITFIELD_SIZE; bitCoord += BITS_PER_CELL) {
            board[flatCoord] = uint8(gameState.bits(bitCoord, BITS_PER_CELL));
            flatCoord++;
        }
    }
    function moveIsOnBoard(uint8 x, uint8 y) public pure returns (bool) {
        if(0 > x || x >= BOARD_SIZE) {
            return false;
        }
        if(0 > y || y >= BOARD_SIZE) {
            return false;
        }
        return true;
    }
    function cellHasNeighboringPiece(uint8 x, uint8 y) public view returns (bool) {
        // Search all eight neighboring spaces.
        for(uint8 delta_x = -1; delta_x <= 1; delta_x += 1) {
            for(uint8 delta_y = -1; delta_y <= 1; delta_y += 1) {
                if(delta_x == 0 && delta_y == 0) {
                    // This is the spot where the piece is placed,
                    // so don't check it.
                    continue;
                }

                // Don't check for pieces off the board.
                if(!moveIsOnBoard(x + delta_x, y + delta_y)) {
                    continue;
                }

                if(getTile(x + delta_x, y + delta_y) != EMPTY) {
                    // We found a piece, so there is a piece neighboring
                    // this square.
                    return true;
                }
            }
        }
        // Checked all neighbors, no piece found.
        return false
    }
    function isMoveValid(uint8 x, uint8 y, bool isWhite) public view returns (bool) {
        // 1. Is the move on the board? If not, illegal.
        if(!moveIsOnBoard(x, y)) {
            return false;
        }

        // 2. Is the space empty? If not, illegal.
        if(getTile(x, y) != EMPTY) {
            return false;
        }

        // 3. Is it next to another piece? If not, illegal.
        if(!cellHasNeighboringEnemyPiece(x, y)) {
            return false;
        }

        // 4. Will you capture another piece if you move there? If not, illegal.

        return true;
    }
    function getName(bool getWhiteName) public view returns (string memory) {
        uint playerIndex = getWhiteName ? 1 : 0;
        return playerNames[playerIndex];
    }
    function getAddress(bool getWhiteAddress) public view returns (address) {
        uint playerIndex = getWhiteAddress ? 1 : 0;
        return playerAddresses[playerIndex];
    }
    function debug() public view returns (uint128) {
        // return gameState.bits(0, 2);
        return gameState;
    }

}
