import { GET_WEB3_INSTANCE } from '../actions/types';

const initialState = {
    web3: null,
    accounts: [],
    account: null,
    networkId: []
};

export default function (state=initialState, action) {
    switch (action.type) {
        case GET_WEB3_INSTANCE:
            return {
                ...state,
                web3: action.payload.web3,
                accounts: action.payload.accounts,
                account: action.payload.account,
                networkId: action.payload.networkId
            };
        default:
            return state;
    }
}
