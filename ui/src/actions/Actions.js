import { TOGGLE_MODAL, GET_COLOR, UPDATE_GAMEBOARD, GET_LEGAL_MOVES, PLAY_MOVE, GET_WEB3_INSTANCE, GET_CONTRACTS } from './types';
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

/*
export const getContracts = (web3) => async (dispatch) => {
    import contracts from wherever they are stored
    contract1 = ..
    contract2 = ..

    dispatch({
        type: GET_CONTRACTS,
        payload: {name: contract1, ...}
    });
};
*/

export const toggleModal = (i) => dispatch => {
    dispatch({
        type: TOGGLE_MODAL,
        payload: i
    });
};

export const getMyColor = (contract, account) => async (dispatch) => {
    try {
        const myColor = await contract.methods.getMyColor().call({ from: account }); // Method not yet merged
        console.log('My Color: ' + myColor);

        dispatch({
            type: GET_COLOR,
            payload: myColor
        });
    } catch (err) {
        alert('Cannot fetch player color, please check console');
        console.log(err);
    }
};

export const getGamestate = (contract, myColor) => async (dispatch) => {
    try {
        const tiles = await contract.methods.getTilesArray().call();
        // dispatch
    } catch (err) {
        alert('Cannot fetch gamestate, please check console');
        console.log(err);
    }
    const parsedGamestate = {
        gamestate: [0, 0, 0, 0, 0, 1, 3, 0, 0, 3, 1, 0, 0, 0, 0, 0],
        myTurn: true
    };

    dispatch({
        type: UPDATE_GAMEBOARD,
        payload: parsedGamestate
    });
};

export const getLegalMoves = () => dispatch => {
    /*
    try {
        const legalMoves = await contract.methods.getLegalMoves().call();
        dispatch ...
    } catch (err) {
        alert('Cannot fetch legal moves, please check console');
        console.log(err);
    }
    */
    const parsedLegalMoves = {
        legalMoves: [false, true, false, false, true, false, false, false, false, false, false, true, false, false, true, false]
    };

    dispatch({
        type: GET_LEGAL_MOVES,
        payload: parsedLegalMoves.legalMoves
    });
};

export const playMove = (index) => dispatch => {
    /*
    try {
        dispatch with payload false (to avoid player making another move while transaction is processed)
        add contract and account to args
        const x = index // 8;
        const y = index % 8;
        await contract.method.playMove(x, y).send({ from: account, gas: 50000 });
        console.log('Successfully played move');
        dispatch ...
    } catch (err) {
        alert('Play move failed, please check console');
        console.log(err);
        dispatch with payload true so player can play again
    }
    */
    console.log('PLAYMOVE ' + index);
    dispatch({
        type: PLAY_MOVE,
    });
};
