import { GET_CURRENT_STATE, ENTER_NAME, CREATE_GAME, TOGGLE_MODAL, GET_COLOR, UPDATE_GAMEBOARD, GET_LEGAL_MOVES, PLAY_MOVE, FORFEIT_GAME, GET_WEB3_INSTANCE, GET_CONTRACTS, YOUR_TURN, NEW_GAME, END_GAME } from './types';
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
        const currentState = await contract.methods.getCurrentState().call({ from: account });
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
        await contract.methods.createNewGame(name).send({ from: account, gas: 6721975 });
        dispatch({
            type: CREATE_GAME,
            payload: { name: name, gameCreated: true }
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
        const myColor = await contract.methods.getMyColor().call({ from: account });
        dispatch({
            type: GET_COLOR,
            payload: myColor
        });
    } catch (err) {
        alert('Cannot fetch player color, please check console');
        console.log(err);
    }
};

export const getGamestate = (contract, account) => async (dispatch) => {
    try {
        const tiles = await contract.methods.getTilesArray().call({ from: account });
        const tilesParsed = tiles.map(val => parseInt(val));
        dispatch({
            type: UPDATE_GAMEBOARD,
            payload: tilesParsed
        });
    } catch (err) {
        alert('Cannot fetch gamestate, please check console');
        console.log(err);
    }
};

export const getLegalMoves = (contract, account) => async (dispatch) => {
    try {
        const legalMoves = await contract.methods.getValidMoves().call({ from: account });
        const legalMovesParsed = legalMoves.map(val => parseInt(val));
        dispatch({
            type: GET_LEGAL_MOVES,
            payload: legalMovesParsed
        });
    } catch (err) {
        alert('Cannot fetch legal moves, please check console');
        console.log(err);
    }
};

export const playMove = (index, contract, account) => async (dispatch) => {
    try {
        dispatch({
            type: PLAY_MOVE,
            payload: false
        });
        const x = index % 8;
        const y = Math.floor(index / 8);
        console.log('Playing move: (' + x + ', ' + y + ')')
        await contract.methods.playMove(x, y).send({ from: account, gas: 6721975 });
    } catch (err) {
        alert('Play move failed, please check console');
        console.log(err);
        dispatch({
            type: PLAY_MOVE,
            payload: true
        });
    }
};

export const passMove = (contract, account) => async (dispatch) => {
    try {
        await contract.methods.passMove().send({ from: account, gas: 6721975 });
        dispatch({
            type: PLAY_MOVE,
            payload: false
        });
    } catch (err) {
        alert('Pass move failed, please check console');
        console.log(err);
    }
};

export const getCurrentTurnAddress = (contract, account) => async (dispatch) => {
    try {
        const currentTurnAddress = await contract.methods.getCurrentTurnAddress().call({ from: account });
        let myTurn = false;
        if (currentTurnAddress === account) {
            myTurn = true;
        }
        dispatch({
            type: YOUR_TURN,
            payload: { myTurn: myTurn, latestGamestate: true }
        });
    } catch (err) {
        alert('Cannot fetch current turn, please check console');
        console.log(err);
    }
};

export const yourTurnEvent = (contract, account) => async (dispatch) => {
    try {
        await contract.events.YourTurn((e, r) => {
            if (e) {
                throw new Error(e);
            }
            let myTurn = false;
            if (r.returnValues.player === account) {
                myTurn = true;
            }
            dispatch({
                type: YOUR_TURN,
                payload: { myTurn: myTurn, latestGamestate: false }
            });
        });
    } catch (err) {
        alert('Error in getting YourTurn Event, please check console');
        console.log(err);
    }
};

export const forfeitGame = (contract, account) => async () => {
    try {
        await contract.methods.forfeit().send({ from: account, gas: 6721975 });
    } catch (err) {
        alert('Forfeit failed, please see console');
        console.log(err);
    }
};

export const forfeitEvent = (contract, account) => async (dispatch) => {
    try {
        await contract.events.Forfeit((e, r) => {
            if (e) {
                throw new Error(e);
            }
            let gameResult = 'LOSER';
            if (r.returnValues.nonForfeitedPlayer === account) {
                gameResult = 'WINNER';
            }
            dispatch({
                type: FORFEIT_GAME,
                payload: gameResult
            });
        });
    } catch (err) {
        alert('Error in getting Forfeit event, please check console');
        console.log(err);
    }
};

export const newGameEvent = (contract, account) => async (dispatch) => {
    try {
        await contract.events.NewGame((e, r) => {
            if (e) {
                throw new Error(e);
            }
            dispatch({
                type: NEW_GAME
            });
            if (r.returnValues.black === account) {
                dispatch({
                    type: YOUR_TURN,
                    payload: { myTurn: true, latestGamestate: true }
                });
            }
        });
    } catch (err) {
        alert('Error getting NewGame event, please check console');
        console.log(err);
    }
};

export const endGameEvent = (contract, account) => async (dispatch) => {
    try {
        await contract.events.EndGame((e, r) => {
            if (e) {
                throw new Error(e);
            }
            let gameResult = 'LOSER';
            if (r.returnValues.isDraw) {
                gameResult = 'DRAW';
            }
            else if (r.returnValues.winner === account) {
                gameResult = 'WINNER';
            }
            dispatch({
                type: END_GAME,
                payload: gameResult
            });
        });
    } catch (err) {
        alert('Error getting EndGame event, please check console');
        console.log(err);
    }
};
