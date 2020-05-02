pragma solidity >=0.5.0 <0.6.0;
pragma experimental ABIEncoderV2;

import "./Board.sol";
contract othellofactory is Board{
    
    event NewGame(address black, address white);
    event YourTurn(address player);
    event Forfeit(address nonForfeitedPlayer);
    event EndGame(address winner, address loser);

    struct Game{
        string black;
        string white;
        address blackaddress;
        address whiteaddress;
        bool isWhiteTurn;
        uint128 gameState;
        bool isMovePassed;
    }
    
    
    Game[] private existingGames;
    address[] waitlistPlayerids;
    string waitlistPlayerName;
    
    mapping (address => bool) activelyPlaying;
    mapping (address => uint) playerToGames; // stores the gameid for every player which is index of the gamme in existing games

    uint8[64] boardState;
    
    // Disable debug mode in parent contract
    constructor() public Board(false) {}
    
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
      currentGame=Game(name, waitlistPlayerName,msg.sender,waitlistPlayerid,false,currentGame.gameState,false);
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
    
    // Returns true if the player can forfeit else false
    function forfeit() public returns(bool isForfeitSuccess){
        // player can only forfeit if he is in any game
        if(activelyPlaying[msg.sender]==false){
            return false;
        }
        else{
           emit Forfeit(getMyOpponent());  // emits forfeit event to let the other player know and display him as winner
           removeUsersFromGame();
           return true; // if true the player who forfeited will be displayed as looser
        }
        
    }
    
   // Removes the players from their games, enabling them to join new game
   function removeUsersFromGame() public{
       address opponent= getMyOpponent();
       activelyPlaying[opponent]=false;
       activelyPlaying[msg.sender]=false;
       delete playerToGames[msg.sender];
       delete playerToGames[opponent]; 
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
        require(msg.sender==getCurrentTurnAddress(),"It is not your turn!");
        setGameState();
        return _getValidMoves();
    }
    
    // Takes the row index and column index of the 8*8 game board
    function playMove(int8 x, int8 y) public {
        require(msg.sender==getCurrentTurnAddress(), "It is not your turn!");
        Game memory currentGame = setGameState();
        existingGames[playerToGames[msg.sender]].isMovePassed=false;
        _playMove(x,y);
        saveGameState(currentGame);
        emit YourTurn(getMyOpponent());
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
    
    // returns the address of opponent, helper for forfeit function
    function getMyOpponent() public view returns(address opponent){
        if (msg.sender==getMyGame().blackaddress){
            return getMyGame().whiteaddress;
        }
        return getMyGame().blackaddress;
    }
    
    
    // returns if the game is end, for the ui to know if they have to call endGame function
    // winner and isDraw are only valid if isGameEnd is true
    function passMove() public returns(bool isGameEnd, address winner, bool isDraw){
        require(msg.sender==getCurrentTurnAddress(),"It is not your turn!");
        if(getMyGame().isMovePassed==true){
            (winner,isDraw)=endGame();
            return(true, winner, isDraw);
        }
        existingGames[playerToGames[msg.sender]].isMovePassed=true;
        existingGames[playerToGames[msg.sender]].isWhiteTurn=!existingGames[playerToGames[msg.sender]].isWhiteTurn; // Should also change the turn and emit YourTurn event
        emit YourTurn(getMyOpponent());
        return (false,msg.sender,false);
    }
    
    // If isDraw is true no player is winner but this function returns black as winner please ignore the winner when isDraw is true
    // If isDraw is false then returns the winner
    // Also emits an event called endGame to notify both the users the game is end
    function endGame() public returns(address _winner, bool _isDraw){
        uint8[64] memory tiles = getTilesArray();
        uint8 black;
        uint8 white;
        address blackaddress=getMyGame().blackaddress;
        address whiteaddress=getMyGame().whiteaddress;
        for(uint8 tile = 0; tile < 64; tile += 1) {
            if(tiles[tile]==BLACK){
                black+=1;
            } 
            else if(tiles[tile]==WHITE){
                white+=1;
            }
        }
        removeUsersFromGame();
        
        _isDraw=white==black?true:false;
        _winner=black>=white?blackaddress:whiteaddress;
        address _looser=_winner==blackaddress?whiteaddress:blackaddress;
        emit EndGame(_winner,_looser);

        return(_winner, _isDraw);
            
    }
    
    // Returns the address of the player whose turn it is
    function getCurrentTurnAddress() private view returns(address currentPlayer){
        address currentTurnAddress=getMyGame().isWhiteTurn? getMyGame().whiteaddress: getMyGame().blackaddress;
        return currentTurnAddress;
    }
    
    // Return the currentState of player's game
    function getCurrentState() public returns (string memory state){
        if (activelyPlaying[msg.sender]==true){
            return "IN_GAME";
        }
        else if((waitlistPlayerids.length!=0) && (waitlistPlayerids[0]==msg.sender)){
            return "MATCHMAKING";
        }
        return "IDLE";
    }
}
