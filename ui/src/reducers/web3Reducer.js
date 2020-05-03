import { GET_WEB3_INSTANCE, GET_CONTRACTS } from '../actions/types';

const initialState = {
    web3: null,
    accounts: [],
    account: null,
    ofContract: null
};

export default function (state=initialState, action) {
    switch (action.type) {
        case GET_WEB3_INSTANCE:
            return {
                ...state,
                web3: action.payload.web3,
                accounts: action.payload.accounts,
                account: action.payload.account
            };
        case GET_CONTRACTS:
            return {
                ...state,
                ofContract: action.payload
            };
        default:
            return state;
    }
}
