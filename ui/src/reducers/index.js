import { combineReducers } from 'redux';

import gameReducer from './gameReducer';
import web3Reducer from './web3Reducer';

export default combineReducers({
    game: gameReducer,
    web3: web3Reducer
});
