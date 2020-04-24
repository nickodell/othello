import { UPDATE_GAMEBOARD, GET_LEGAL_MOVES } from '../actions/types';

const initialState = {
    gamestate: [],
    legalMoves: []
};

export default function (state=initialState, action) {
    switch (action.type) {
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
        default:
            return state;
    }
}
