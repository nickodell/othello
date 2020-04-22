import { UPDATE_GAMEBOARD, GET_LEGAL_MOVES } from './types';

export const getGamestate = (newMove) => dispatch => {
    const newGamestate = await fetch(''); // replace with web3 call
    const parsedGamestate = await newGamestate.json();

    dispatch({
        type: UPDATE_GAMEBOARD,
        payload: parsedGamestate.gamestate
    });
};

export const getLegalMoves = () => dispatch => {
    const legalMoves = await fetch(''); // replace with web3 call
    const parsedLegalMoves = await legalMoves.json();

    dispatch({
        type: GET_LEGAL_MOVES,
        payload: parsedLegalMoves.legalMoves
    });
};
