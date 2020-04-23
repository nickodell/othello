pragma solidity >=0.5.0 <0.6.0;
pragma experimental ABIEncoderV2;

import "./othelloboard.sol";

contract othellofactory is othelloboard{
    struct Game{
        string player1;
        string player2;
        // address adress1;
        // address address2;
        uint32[64] gameState;
    }
    
    string[] private allplayers;
    uint playerCount;
    
    Game[] public existinggames;
    mapping (uint => address) playeridToAddress;
    mapping (address => uint) addressToPlayerid;
    mapping (address => string) addressToPlayername;
    mapping (uint32 => Game) gameidToGames;
    mapping (address => Game[]) playerToExistingGames;

    function viewNumberOfPlayers() public view returns (uint){
        return playerCount;
    } 
    
    function register(string memory name) public{
        playerCount=allplayers.push(name);
        addressToPlayerid[msg.sender]=playerCount;
        playeridToAddress[playerCount]=msg.sender;
        addressToPlayername[msg.sender]=name;
    }
   
   function createNewGame(uint opponetPlayerId) public{
       require(msg.sender!=playeridToAddress[opponetPlayerId]); 
       uint32[64] memory board=initializeBoard();
       uint gameid=existinggames.push(Game(addressToPlayername[msg.sender],addressToPlayername[playeridToAddress[opponetPlayerId]],board))-1;
    //   playerToExistingGames[msg.sender]=gameid;
       playerToExistingGames[playeridToAddress[opponetPlayerId]].push(existinggames[gameid]);
       playerToExistingGames[msg.sender].push(existinggames[gameid]);

   }
   
  function getMyGames() public view returns(Game[] memory){
      return playerToExistingGames[msg.sender];
  }


}