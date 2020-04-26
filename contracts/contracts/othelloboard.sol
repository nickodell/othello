pragma solidity >=0.5.0 <0.6.0;

contract othelloboard {
    function initializeBoard() internal returns (uint32[64] memory){
        uint32[64] memory board;
        board[27]=1;
        board[36]=1;
        board[28]=2;
        board[37]=2;
        return board;
    }
}
