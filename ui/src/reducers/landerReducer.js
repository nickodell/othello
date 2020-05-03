import { GET_CURRENT_STATE, ENTER_NAME, CREATE_GAME, NEW_GAME } from '../actions/types';

const initialState = {
    currentState: '',
    name: '',
    gameCreated: null
};

export default function(state=initialState, action) {
    switch (action.type) {
        case GET_CURRENT_STATE:
            return {
                ...state,
                currentState: action.payload
            };
        case ENTER_NAME:
            return {
                ...state,
                name: action.payload
            };
        case CREATE_GAME:
            return {
                ...state,
                name: action.payload.name,
                gameCreated: action.payload.gameCreated
            };
        case NEW_GAME:
            return {
                ...state,
                gameCreated: true
            };
        default:
            return state;
    }
}
