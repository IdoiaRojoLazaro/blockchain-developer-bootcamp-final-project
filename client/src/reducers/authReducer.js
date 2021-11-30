import { types } from '../types/types';

const initialState = {
  checking: true,
  connection: true,
  web3Injected: null,
  status: types.idle
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.authNoWeb3Injected:
      return {
        ...state,
        checking: false,
        web3Injected: false,
        status: types.loading
      };
    case types.authWeb3Injected:
      return {
        ...state,
        checking: false,
        web3Injected: true,
        status: types.loading
      };
    case types.authFinishLoading:
      return {
        ...state,
        status: types.completed
      };

    case types.authSetAccountBalance:
      return {
        ...state,
        status: types.completed,
        account: action.payload.account,
        balance: action.payload.balance
      };

    case types.authLogin:
      return {
        ...state,
        ...action.payload,
        status: types.completed
      };

    case types.authUpdateBalance:
      return {
        ...state,
        balance: action.payload
      };

    case types.authLogout:
      return {
        checking: false,
        connection: true,
        web3Injected: false,
        status: types.completed
      };

    default:
      return state;
  }
};
