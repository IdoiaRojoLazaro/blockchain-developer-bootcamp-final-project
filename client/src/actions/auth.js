import { types } from '../types/types';

export const logout = () => ({ type: types.authLogout });

export const startChecking = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') || null;
  return async dispatch => {
    if (isAuthenticated) {
      dispatch({
        type: types.authLogin,
        payload: {
          isAuthenticated: true
        }
      });
    } else {
      dispatch(checkingFinish());
    }
  };
};

const checkingFinish = () => ({ type: types.authCheckingFinish });
