import { GET_COLOR, UPDATE_GAMEBOARD, GET_LEGAL_MOVES, PLAY_MOVE } from '../actions/types';

const initialState = {
    gamestate: [],
    legalMoves: [],
    myTurn: false,
    myColor: null
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
                gamestate: action.payload.gamestate,
                myTurn: action.payload.myTurn
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
        default:
            return state;
    }
}
