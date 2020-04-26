pragma solidity >=0.5.0 <0.6.0;
pragma experimental ABIEncoderV2;

import "./othelloboard.sol";
import "./Board.sol";
contract othellofactory is Board{
    struct Game{
        string black;
        string white;
        address blackaddress;
        address whiteaddress;
        bool isWhiteTurn;
        uint128 gameState;
    }
    
    struct GameDetails{
        uint gameid;
        string opponent;
    }
    
    struct Player{
        uint playerid;
        string name;
    }
    
    // Board board;
    
    Player[] private allplayers;
    uint playerCount=0;
    
    Game currentGame;
    uint currentGameId;
    
    Game[] public existingGames;
    mapping (uint => address) playerIdToAddress;
    // mapping (address => uint) addressToPlayerid;
    mapping (address => string) addressToPlayerName;
    mapping (address => bool) registeredAddresses;
    mapping (address => GameDetails[]) playerToExistingGames;


    function viewPlayers() public view returns (Player[] memory){
        return allplayers;
    }
    
    function register(string memory name) public{
        require(registeredAddresses[msg.sender]==false, "You are already registered!!");
        allplayers.push(Player(playerCount,name));
        playerCount+=1;
        registeredAddresses[msg.sender]=true;
        // addressToPlayerid[msg.sender]=playerCount;
        playerIdToAddress[playerCount]=msg.sender;
        addressToPlayerName[msg.sender]=name;
    }
   
   function createNewGame(uint opponentPlayerId) public{
       require(msg.sender!=playerIdToAddress[opponentPlayerId]); 
      currentGame.gameState=0;
      currentGame=Game(addressToPlayerName[msg.sender], addressToPlayerName[playerIdToAddress[opponentPlayerId]],msg.sender,playerIdToAddress[opponentPlayerId],false,currentGame.gameState);
      currentGameId=existingGames.push(currentGame)-1;
      initializeBoard(currentGame.gameState,currentGame.blackaddress,currentGame.whiteaddress,currentGame.isWhiteTurn,true);

       // playerToExistingGames[msg.sender]=gameid;
      playerToExistingGames[playerIdToAddress[opponentPlayerId]].push(GameDetails(currentGameId,currentGame.black));
      playerToExistingGames[msg.sender].push(GameDetails(currentGameId,currentGame.white));
    }
   
    function getMyGames() public view returns(GameDetails[] memory){
        return playerToExistingGames[msg.sender];
    }
    
    function loadExistingGame(uint gameid) public returns (Game memory){
        currentGameId=gameid;
        currentGame =existingGames[gameid];
        initializeBoard(currentGame.gameState,currentGame.blackaddress,currentGame.whiteaddress,currentGame.isWhiteTurn,true);
        return currentGame;
        
    }
    
    function saveGame() public{
        currentGame.gameState=Board.gameState;
        currentGame.isWhiteTurn=Board.whitesMove;
        existingGames[currentGameId]=currentGame;
    }

}