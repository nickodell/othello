pragma solidity >=0.5.0 <0.6.0;
pragma experimental ABIEncoderV2;

import "./othelloboard.sol";
import "./Board.sol";
contract othellofactory is Board{
    
    event NewGame(address player1, address player2);
    event YourTurn(address player);

    struct Game{
        string black;
        string white;
        address blackaddress;
        address whiteaddress;
        bool isWhiteTurn;
        uint128 gameState;
    }
    
    
    Game[] private existingGames;
    address[] private waitlistPlayerids;
    string waitlistPlayerName;
    
    mapping (address => bool) activelyPlaying;
    mapping (address => uint) playerToGames; // stores the gameid for every player which is index of the gamme in existing games

    uint8[64] boardState;
    
   // Implements matchmaking api to create a game
   // Returns true if game is created, false if the player is added to waitlist
   function createNewGame(string memory name) public returns (bool){
       require(activelyPlaying[msg.sender]!=true); // make sure one player can play only one game at a time
       
       // If there is already another player waiting to play game, New game will be created otherwise player will be added to waitlist
       if (waitlistPlayerids.length==0){   
           waitlistPlayerids.push(msg.sender);
           waitlistPlayerName=name;
           return false;
       }
      Game memory currentGame; 
      uint currentGameId;
      currentGame.gameState=0;
      address waitlistPlayerid=waitlistPlayerids[0];
      delete waitlistPlayerids;
      currentGame=Game(name, waitlistPlayerName,msg.sender,waitlistPlayerid,false,currentGame.gameState);
      currentGameId=existingGames.push(currentGame)-1;
      initializeBoard(currentGame.gameState,currentGame.blackaddress,currentGame.whiteaddress,currentGame.isWhiteTurn,true);
      
      activelyPlaying[waitlistPlayerid]=true;
      activelyPlaying[msg.sender]=true;

      playerToGames[waitlistPlayerid]=currentGameId;
      playerToGames[msg.sender]=currentGameId;
      saveGameState(currentGame);
      emit NewGame(msg.sender,waitlistPlayerid);

      return true;
    }
   
   // Returns the updated Game struct of the player if he has any game
    function getMyGame() public view returns(Game memory){
        require(activelyPlaying[msg.sender]==true,"You are not in any game");
        return existingGames[playerToGames[msg.sender]];
    }
    
    // Initialize the board with the game state of this player's game
    function setGameState() private returns(Game memory){
        Game memory currentGame=existingGames[playerToGames[msg.sender]];
        initializeBoard(currentGame.gameState,currentGame.blackaddress,currentGame.whiteaddress,currentGame.isWhiteTurn,false);
        return currentGame;
    }
    
    // return the validMoves as a boolean 64 bit array with 1 for potential squares
    function getValidMoves() public returns (bool[64] memory validMoves, bool whiteToMove){
        setGameState();
        return _getValidMoves();
    }
    
    // Takes the row index and column index of the 8*8 game board
    function playMove(int8 x, int8 y) public {
        Game memory currentGame = setGameState();
        _playMove(x,y);
        saveGameState(currentGame);
        emit YourTurn(getAddress(whitesMove));
    }
    
    // We should update the existing games with the new gameState after every move
    function saveGameState(Game memory currentGame) private{
        currentGame.gameState=Board.gameState;
        currentGame.isWhiteTurn=Board.whitesMove;
        existingGames[playerToGames[msg.sender]]=currentGame;
    }
    
    // Returns gameBoard as a 64 integer array 
    function getTilesArray() public view returns (uint8[64] memory board) {
        uint128 gameState=getMyGame().gameState;
        // Return array of board values, 1 per space
        uint8 flatCoord = 0;
        for(uint8 bitCoord = 0; bitCoord < BITFIELD_SIZE; bitCoord += BITS_PER_CELL) {
            board[flatCoord] = uint8(gameState.bits(bitCoord, BITS_PER_CELL));
            flatCoord++;
        }
    }
    
    function getMyColor() public view returns(string memory){
        if (msg.sender==getMyGame().blackaddress){
            return "BLACK";
        }
        return "WHITE";
    }
}