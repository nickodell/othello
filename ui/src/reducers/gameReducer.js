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
            let myTurn = false;
            if (((state.myColor === 'WHITE') && (action.payload.whiteToMove)) || ((state.myColor === 'BLACK') && (!action.payload.whiteToMove))) {
                myTurn = true;
            }
            // console.log("action.payload", action.payload)
            // console.log("validMoves", action.payload.validMoves)
            return {
                ...state,
                legalMoves: action.payload,
                myTurn: myTurn
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
                myTurn: true
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
