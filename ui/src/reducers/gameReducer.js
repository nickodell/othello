import { GET_COLOR, UPDATE_GAMEBOARD, GET_LEGAL_MOVES, PLAY_MOVE, FORFEIT_GAME, YOUR_TURN, END_GAME } from '../actions/types';

const initialState = {
    gamestate: [],
    legalMoves: [],
    myTurn: false,
    myColor: null,
    gameResult: null
};

export default function (state=initialState, action) {
    switch (action.type) {
        case GET_COLOR:
            return {
                ...state,
                myColor: action.payload
            };
        case UPDATE_GAMEBOARD:
            return {
                ...state,
                gamestate: action.payload
            };
        case GET_LEGAL_MOVES:
            return {
                ...state,
                legalMoves: action.payload
            };
        case PLAY_MOVE:
            return {
                ...state,
                myTurn: action.payload
            };
        case FORFEIT_GAME:
            return {
                ...state,
                gameResult: action.payload
            };
        case YOUR_TURN:
            return {
                ...state,
                myTurn: action.payload
            };
        case END_GAME:
            return {
                ...state,
                gameResult: action.payload
            };
        default:
            return state;
    }
}
