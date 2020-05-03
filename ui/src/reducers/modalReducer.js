import { TOGGLE_MODAL } from '../actions/types';

const initialState = {
    showModal: false,
    tileValue: 1
};

export default function (state=initialState, action) {
    switch (action.type) {
        case TOGGLE_MODAL:
            return {
                ...state,
                showModal: !state.showModal,
                tileValue: action.payload
            };
        default:
            return state;
    }
}
