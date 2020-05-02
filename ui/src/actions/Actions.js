import { GET_CURRENT_STATE, ENTER_NAME, CREATE_GAME, TOGGLE_MODAL, GET_COLOR, UPDATE_GAMEBOARD, GET_LEGAL_MOVES, PLAY_MOVE, FORFEIT_GAME, GET_WEB3_INSTANCE, GET_CONTRACTS } from './types';
import getWeb3 from '../utils/getWeb3';

import othellofactory from '../contracts/othellofactory.json';

export const getWeb3Instance = () => async (dispatch) => {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    dispatch({
        type: GET_WEB3_INSTANCE,
        payload: {web3: web3, accounts: accounts, account: account}
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

export const getCurrentState = (contract, account) => async (dispatch) => {
    try {
        console.log('current state action');
        const currentState = await contract.methods.getCurrentState().send({ from: account, gas: 50000 });
        console.log('current state: ' + currentState);
        dispatch({
            type: GET_CURRENT_STATE,
            payload: currentState
        });
    } catch (err) {
        alert('Cannot get current game state, please check console');
        console.log(err);
    }
};

export const enterName = (name) => dispatch => {
    dispatch({
        type: ENTER_NAME,
        payload: name
    });
};

export const createNewGame = (contract, account, name) => async (dispatch) => {
    try {
        const gameCreated = await contract.methods.createNewGame(name).send({ from: account, gas: 50000 });
        dispatch({
            type: CREATE_GAME,
            payload: { name: name, gameCreated: gameCreated }
        });
    } catch (err) {
        alert(err);
        console.log(err);
    }
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

export const forfeitGame = (contract, account) => async (dispatch) => {
    try {
        const isForfeitSuccess = await contract.methods.forfeit().send({ from: account, gas: 50000 });
        if (isForfeitSuccess) {
            dispatch({
                type: FORFEIT_GAME
            });
        } else {
            throw new Error('Forfeit function returned false');
        }
    } catch (err) {
        alert('Forfeit failed, please see console');
        console.log(err);
    }
};
