import { types } from '../types/types';

export const getUsers = (contract, account) => {
  return async dispatch => {
    dispatch({ type: types.usersLoading });
    contract.methods
      .getAllUsers()
      .call({ from: account })
      .then(res => {
        dispatch({
          type: types.setUsers,
          payload: res
        });
      });
  };
};
