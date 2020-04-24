import { UPDATE_GAMEBOARD, GET_LEGAL_MOVES } from './types';

// TODO: Replace by web3 calls
export const getGamestate = () => dispatch => {
    // const newGamestate = await fetch('');
    // const parsedGamestate = await newGamestate.json();
    const parsedGamestate = {
        gamestate: [0, 0, 0, 0, 0, 2, 3, 0, 0, 3, 2, 0, 0, 0, 0, 0]
    };

    dispatch({
        type: UPDATE_GAMEBOARD,
        payload: parsedGamestate.gamestate
    });
};

export const getLegalMoves = () => dispatch => {
    // const legalMoves = await fetch('');
    // const parsedLegalMoves = await legalMoves.json();
    const parsedLegalMoves = {
        legalMoves: [1, 4, 11, 14]
    };

    dispatch({
        type: GET_LEGAL_MOVES,
        payload: parsedLegalMoves.legalMoves
    });
};
