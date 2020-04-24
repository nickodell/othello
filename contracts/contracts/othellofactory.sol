pragma solidity >=0.5.0 <0.6.0;
pragma experimental ABIEncoderV2;

import "./othelloboard.sol";

contract othellofactory is othelloboard{
    struct Game{
        string player1;
        string player2;
        // address address1;
        // address address2;
        uint32[64] gameState;
    }
    
    string[] private allplayers;
    uint playerCount;
    
    Game[] public existingGames;
    mapping (uint => address) playerIdToAddress;
    mapping (address => uint) addressToPlayerid;
    mapping (address => string) addressToPlayerName;
    mapping (uint32 => Game) gameIdToGames;
    mapping (address => Game[]) playerToExistingGames;

    function viewNumberOfPlayers() public view returns (uint){
        return playerCount;
    } 
    
    function register(string memory name) public{
        playerCount=allplayers.push(name);
        addressToPlayerid[msg.sender]=playerCount;
        playerIdToAddress[playerCount]=msg.sender;
        addressToPlayerName[msg.sender]=name;
    }
   
   function createNewGame(uint opponentPlayerId) public{
       require(msg.sender!=playerIdToAddress[opponentPlayerId]); 
       uint32[64] memory board=initializeBoard();
       uint gameid=existingGames.push(Game(addressToPlayerName[msg.sender], addressToPlayerName[playerIdToAddress[opponentPlayerId]],board))-1;
    //   playerToExistingGames[msg.sender]=gameid;
       playerToExistingGames[playerIdToAddress[opponentPlayerId]].push(existingGames[gameid]);
       playerToExistingGames[msg.sender].push(existingGames[gameid]);

   }
   
  function getMyGames() public view returns(Game[] memory){
      return playerToExistingGames[msg.sender];
  }


}