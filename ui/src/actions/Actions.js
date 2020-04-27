import { UPDATE_GAMEBOARD, GET_LEGAL_MOVES, PLAY_MOVE, GET_WEB3_INSTANCE } from './types';
import getWeb3 from '../utils/getWeb3';

export const getWeb3Instance = () => async (dispatch) => {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    const networkId = await web3.eth.net.getId();

    dispatch({
        type: GET_WEB3_INSTANCE,
        payload: {web3: web3, accounts: accounts, account: account, networkId: networkId}
    });
};

// TODO: Replace by web3 calls
export const getGamestate = () => dispatch => {
    // const newGamestate = await fetch('');
    // const parsedGamestate = await newGamestate.json();
    const parsedGamestate = {
        gamestate: [0, 0, 0, 0, 0, 2, 3, 0, 0, 3, 2, 0, 0, 0, 0, 0],
        myTurn: true
    };

    dispatch({
        type: UPDATE_GAMEBOARD,
        payload: parsedGamestate
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

export const playMove = (index) => dispatch => {
    console.log('PLAYMOVE ' + index);
    dispatch({
        type: PLAY_MOVE,
    });
};
