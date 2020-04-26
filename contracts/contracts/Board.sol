pragma solidity >=0.5.0 <0.6.0;

// Bit manipulation library
import {Bits128} from "./Bits.sol";

contract Board {
    uint8 constant internal EMPTY = 0;
    uint8 constant internal BLACK = 1;
    uint8 constant internal WHITE = 3;
    int8 constant internal BOARD_SIZE = 8;
    uint8 constant internal BITS_PER_CELL = 2;
    // Also equal to BOARD_SIZE * BOARD_SIZE * BITS_PER_CELL
    uint8 constant internal BITFIELD_SIZE = 128;
    address[2] playerAddresses;
    uint128 public gameState;
    bool whitesMove;
    bool debugMode;

    // This allows us to call methods from Bits.sol on a uint128
    using Bits128 for uint128;

 
    function initializeBoard(uint128 state,address blackAddress, address whiteAddress, bool _isWhiteTurn, bool _isNewGame) internal {
        debugMode = _isNewGame;
        playerAddresses[0]=blackAddress;
        playerAddresses[1]=whiteAddress;
        // Clear board
        gameState = state;
        whitesMove = _isWhiteTurn;
        // Set middle tiles
        if(_isNewGame==true){
            setTile(3, 3, WHITE);
            setTile(4, 3, BLACK);
            setTile(3, 4, BLACK);
            setTile(4, 4, WHITE);
        }
    }
    function getBitfieldCoordinate(int8 x, int8 y) internal pure returns (uint8 bitCoord) {
        // Is x and y in the range 0 to 7?
        assert(0 <= x && x < BOARD_SIZE);
        assert(0 <= y && y < BOARD_SIZE);

        // We need to take a 2-dimensional coordinate and change it into a 1-dimensional coordinate.
        // To do this, we decide that all cells with the same y value will be next to each other,
        // followed by the cells with the next y value. If you use x to represent the column number, and
        // use y to represent the row number, then the cells are stored in the same order as you would
        // read them in a book, reading right-to-left and top-to-bottom.

        // Here's a diagram: https://docs.unity3d.com/StaticFiles/ScriptRefImages/RectXY.svg

        // This uint8 cast is safe because x and y cannot be negative at this point
        uint8 flatCoord = uint8(x + (BOARD_SIZE * y));
        bitCoord = BITS_PER_CELL * flatCoord;
        return bitCoord;
    }
    function setTile(int8 x, int8 y, uint8 value) internal {
        // Is it a valid tile?
        assert(value == EMPTY || value == BLACK || value == WHITE);
        uint8 bitCoord = getBitfieldCoordinate(x, y);
        gameState = gameState.setBits(bitCoord, BITS_PER_CELL, value);
    }
    function getTile(int8 x, int8 y) private view returns (uint8 value) {
        uint8 bitCoord = getBitfieldCoordinate(x, y);
        return uint8(gameState.bits(bitCoord, BITS_PER_CELL));
    }
    function getTiles() private view returns (uint8[64] memory board) {
        // Return array of board values, 1 per space
        uint8 flatCoord = 0;
        for(uint8 bitCoord = 0; bitCoord < BITFIELD_SIZE; bitCoord += BITS_PER_CELL) {
            board[flatCoord] = uint8(gameState.bits(bitCoord, BITS_PER_CELL));
            flatCoord++;
        }
    }
    function moveIsOnBoard(int8 x, int8 y) private pure returns (bool) {
        if(0 > x || x >= BOARD_SIZE) {
            return false;
        }
        if(0 > y || y >= BOARD_SIZE) {
            return false;
        }
        return true;
    }
    function cellHasNeighboringEnemyPiece(int8 x, int8 y, uint8 enemyColor) private view returns (bool) {
        // Search all eight neighboring spaces.
        for(int8 delta_x = -1; delta_x <= 1; delta_x += 1) {
            for(int8 delta_y = -1; delta_y <= 1; delta_y += 1) {
                if(delta_x == 0 && delta_y == 0) {
                    // This is the spot where the piece will be placed,
                    // so don't check it.
                    continue;
                }

                // Don't check for pieces off the board.
                if(!moveIsOnBoard(x + delta_x, y + delta_y)) {
                    continue;
                }

                if(getTile(x + delta_x, y + delta_y) == enemyColor) {
                    // We found a piece, so there is an enemy piece neighboring
                    // this square.
                    return true;
                }
            }
        }
        // Checked all neighbors, no piece found.
        return false;
    }
    function searchForCapturablePiecesInDirection(int8 x, int8 y,
                                                  int8 delta_x, int8 delta_y,
                                                  uint8 enemyColor, uint8 friendlyColor) private view returns (bool) {
        // Delta value of 0,0 will cause an infinite loop.
        assert(!(delta_x == 0 && delta_y == 0));

        // Have we found an enemy piece yet?
        bool foundEnemyPiece = false;

        // x and y represent the coordinates of the piece to be placed. Add the deltas
        // so that we take one step away from the piece-to-be-placed.
        x += delta_x;
        y += delta_y;
        while(moveIsOnBoard(x, y)) {
            if(foundEnemyPiece) {
                // We found an enemy piece on a previous run through this loop.

                uint8 tile = getTile(x, y);
                if(tile == enemyColor) {
                    // Found another enemy piece. Keep looping.
                } else if(tile == friendlyColor) {
                    // We found an enemy piece followed by a friendly piece.
                    // We can capture.
                    return true;
                } else {
                    // Found an empty space. We can't capture.
                    return false;
                }
            } else {
                // First run through the loop

                if(getTile(x, y) == enemyColor) {
                    // We found an enemy piece. We could capture it if there's a friendly piece
                    // at the end.
                    foundEnemyPiece = true;
                } else {
                    // We found a friendly piece or an empty cell, without finding any enemy pieces
                    // in between. Therefore, we can't capture in this direction.
                    return false;
                }
            }
            x += delta_x;
            y += delta_y;
        }
        // We went off the board without finding a friendly piece. Therefore, we can't capture
        // in this direction.
        return false;
    }
    function searchForCapturablePieces(int8 x, int8 y, uint8 enemyColor, uint8 friendlyColor) private view returns (bool) {
        // Loop over all directions
        for(int8 delta_x = -1; delta_x <= 1; delta_x += 1) {
            for(int8 delta_y = -1; delta_y <= 1; delta_y += 1) {
                if(delta_x == 0 && delta_y == 0) {
                    // This direction does nothing. Skip it.
                    continue;
                }
                if(searchForCapturablePiecesInDirection(x, y, delta_x, delta_y, enemyColor, friendlyColor)) {
                    // We can capture in this direction. Since we only need to find one direction to
                    // capture in, we're done.
                    return true;
                }
            }
        }
        // We didn't find any pieces to capture, in any direction
        return false;
    }
    function isValidMove(int8 x, int8 y, bool isWhite) public view returns (bool) {
        uint8 enemyColor = isWhite ? BLACK : WHITE;
        uint8 friendlyColor = isWhite ? WHITE : BLACK;

        // 1. Is the move on the board? If not, illegal.
        if(!moveIsOnBoard(x, y)) {
            return false;
        }

        // 2. Is the space empty? If not, illegal.
        if(getTile(x, y) != EMPTY) {
            return false;
        }

        // 3. Is it next to another enemy piece? If not, illegal.
        if(!cellHasNeighboringEnemyPiece(x, y, enemyColor)) {
            return false;
        }

        // 4. Will you capture another piece if you move there? If not, illegal.
        if(!searchForCapturablePieces(x, y, enemyColor, friendlyColor)) {
            return false;
        }
        return true;
    }
    function getValidMoves() public view returns (bool[64] memory validMoves, bool whiteToMove) {
        // Return list of cells with valid moves.
        uint8 i = 0;
        for(int8 y = 0; y < BOARD_SIZE; y++) {
            for(int8 x = 0; x < BOARD_SIZE; x++) {
                validMoves[i] = isValidMove(x, y, whitesMove);
                i++;
            }
        }

        // Also tell the caller whose move it is, so they don't display legal moves for the other player.
        whiteToMove = whitesMove;
        return(validMoves, whiteToMove);
    }
    function traverseAndFlip(int8 x, int8 y,
                             int8 delta_x, int8 delta_y,
                             uint8 enemyColor, uint8 friendlyColor) internal {
        // Note: This function assumes that the caller has already checked whether it is legal to
        // capture in this direction, by using searchForCapturablePiecesInDirection().
        x += delta_x;
        y += delta_y;
        while(moveIsOnBoard(x, y) && getTile(x, y) == enemyColor) {
            setTile(x, y, friendlyColor);
            x += delta_x;
            y += delta_y;
        }
    }
    // function playMove(int8 x, int8 y, bool isWhite) public {
    function playMove(int8 x, int8 y) public {
        assert(isValidMove(x, y, whitesMove));

        assert(getAddress(whitesMove) == msg.sender);

        // The move is valid, so play it. Place our tile on the board. Then, search in every direction
        // for capturable pieces, and flip them to our color.
        uint8 enemyColor = whitesMove ? BLACK : WHITE;
        uint8 friendlyColor = whitesMove ? WHITE : BLACK;

        setTile(x, y, friendlyColor);

        for(int8 delta_x = -1; delta_x <= 1; delta_x += 1) {
            for(int8 delta_y = -1; delta_y <= 1; delta_y += 1) {
                if(delta_x == 0 && delta_y == 0) {
                    // This direction does nothing. Skip it.
                    continue;
                }
                if(searchForCapturablePiecesInDirection(x, y, delta_x, delta_y, enemyColor, friendlyColor)) {
                    // We can capture in this direction.
                    traverseAndFlip(x, y, delta_x, delta_y, enemyColor, friendlyColor);
                }
            }
        }

        // It's now the other player's move
        whitesMove = !whitesMove;
    }
   
    function getAddress(bool isWhite) private view returns (address) {
        uint playerIndex = isWhite ? 1 : 0;
        return playerAddresses[playerIndex];
    }

}
