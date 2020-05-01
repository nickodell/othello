import { TOGGLE_MODAL, GET_COLOR, UPDATE_GAMEBOARD, GET_LEGAL_MOVES, PLAY_MOVE, GET_WEB3_INSTANCE, GET_CONTRACTS } from './types';
import getWeb3 from '../utils/getWeb3';

import othellofactory from '../contracts/othellofactory.json';

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

export const getContracts = (web3) => async (dispatch) => {
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = othellofactory.networks[networkId];
    const ofContract = new web3.eth.Contract(
        othellofactory.abi,
        deployedNetwork && deployedNetwork.address
    );
    dispatch({
        type: GET_CONTRACTS,
        payload: ofContract
    });
};

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

export const getLegalMoves = (contract) => async (dispatch) => {
    try {
        const legalMoves = await contract.methods.getValidMoves().call();
        const parsedLegalMoves = await legalMoves.json();
        console.log('LEGAL MOVES: ' + parsedLegalMoves)
        // dispatch ...
    } catch (err) {
        alert('Cannot fetch legal moves, please check console');
        console.log(err);
    }
    const parsedLegalMoves = {
        legalMoves: [false, true, false, false, true, false, false, false, false, false, false, true, false, false, true, false]
    };

    dispatch({
        type: GET_LEGAL_MOVES,
        payload: parsedLegalMoves.legalMoves
    });
};

export const playMove = (index, contract, account) => async (dispatch) => {
    try {
        dispatch({
            type: PLAY_MOVE,
            payload: false
        });
        const x = Math.floor(index / 4);
        const y = index % 4;
        console.log('Playing move: (' + x + ', ' + y + ')')
        await contract.methods.playMove(x, y).send({ from: account, gas: 50000 });
        console.log('Successfully played move');
    } catch (err) {
        alert('Play move failed, please check console');
        console.log(err);
        dispatch({
            type: PLAY_MOVE,
            payload: true
        });
    }
};
