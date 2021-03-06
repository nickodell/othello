import { combineReducers } from 'redux';

import gameReducer from './gameReducer';
import web3Reducer from './web3Reducer';
import modalReducer from './modalReducer';
import landerReducer from './landerReducer';

export default combineReducers({
    game: gameReducer,
    web3: web3Reducer,
    modal: modalReducer,
    lander: landerReducer
});
