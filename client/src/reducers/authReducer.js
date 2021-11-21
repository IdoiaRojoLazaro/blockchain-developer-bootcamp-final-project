import { types } from '../types/types';

const initialState = {
  checking: true,
  connection: true
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.authNoMetamaskInstalled:
      return {
        ...state,
        checking: false,
        connection: false
      };

    case types.authLogin:
      return {
        ...state,
        ...action.payload,
        checking: false,
        connection: true
      };

    case types.authCheckingFinish:
      return {
        ...state,
        checking: false,
        connection: true
      };

    case types.authCheckingConnectionFail:
      return {
        ...state,
        checking: false,
        connection: false
      };

    case types.authLogout:
      return {
        checking: false,
        connection: true
      };

    default:
      return state;
  }
};
