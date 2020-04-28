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
    mapping (address => string) addressToPlayerName;
    mapping (address => bool) registeredAddresses;
    mapping (address => bool) activelyPlaying;
    mapping (address => uint) playerToExistingGames;

    uint8[64] boardState;
    function register(string memory name) public{
        require(registeredAddresses[msg.sender]==false, "You are already registered!!");
        registeredAddresses[msg.sender]=true;
        addressToPlayerName[msg.sender]=name;
    }
   
   function createNewGame() public returns (bool){
       require(activelyPlaying[msg.sender]!=true);
       if (waitlistPlayerids.length==0){
           waitlistPlayerids.push(msg.sender);
           return false;
       }
      Game memory currentGame; 
      uint currentGameId;
      currentGame.gameState=0;
      address waitlistPlayerid=waitlistPlayerids[0];
      delete waitlistPlayerids;
      currentGame=Game(addressToPlayerName[msg.sender], addressToPlayerName[waitlistPlayerid],msg.sender,waitlistPlayerid,false,currentGame.gameState);
      currentGameId=existingGames.push(currentGame)-1;
      initializeBoard(currentGame.gameState,currentGame.blackaddress,currentGame.whiteaddress,currentGame.isWhiteTurn,true);
      
      activelyPlaying[waitlistPlayerid]=true;
      activelyPlaying[msg.sender]=true;

      playerToExistingGames[waitlistPlayerid]=currentGameId;
      playerToExistingGames[msg.sender]=currentGameId;
      saveGameState(currentGame);
      emit NewGame(msg.sender,waitlistPlayerid);

      return true;
    }
   
   // Returns the updated Game struct of the player
    function getMyGame() public view returns(Game memory){
        require(activelyPlaying[msg.sender]==true,"You are not in any game");
        return existingGames[playerToExistingGames[msg.sender]];
    }
    
    function setGameState() private returns(Game memory){
        Game memory currentGame=existingGames[playerToExistingGames[msg.sender]];
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
    
    
    function saveGameState(Game memory currentGame) private{
        currentGame.gameState=Board.gameState;
        currentGame.isWhiteTurn=Board.whitesMove;
        existingGames[playerToExistingGames[msg.sender]]=currentGame;
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
}