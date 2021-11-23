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

    case types.authLogin:
      return {
        ...state,
        ...action.payload
      };

    // case types.authCheckingFinish:
    //   return {
    //     ...state,
    //     checking: false,
    //     connection: true
    //   };

    // case types.authCheckingConnectionFail:
    //   return {
    //     ...state,
    //     checking: false,
    //     connection: false
    //   };

    // case types.authLogout:
    //   return {
    //     checking: false,
    //     connection: true
    //   };

    default:
      return state;
  }
};
