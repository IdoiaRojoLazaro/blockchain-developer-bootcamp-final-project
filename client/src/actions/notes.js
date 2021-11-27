import { types } from '../types/types';

export const getNotes = (contract, account) => {
  return async dispatch => {
    dispatch({ type: types.notesLoading });
    contract.methods
      .getAllNotes()
      .call({ from: account })
      .then(res => {
        console.log(res);
        dispatch({
          type: types.setNotes,
          payload: res
        });
      });
  };
};

export const getMyPurchasedNotes = (contract, account) => {
  return async dispatch => {
    dispatch({ type: types.notesLoading });
    contract.methods
      .getMyPurchasedNotes()
      .call({ from: account })
      .then(res => {
        dispatch({
          type: types.setNotesBought,
          payload: res
        });
      });
  };
};

export const getUploadedNotes = (contract, account) => {
  return async dispatch => {
    dispatch({ type: types.notesLoading });
    contract.methods
      .getOwnedNotes()
      .call({ from: account })
      .then(res => {
        dispatch({
          type: types.setUploadedNotes,
          payload: res
        });
      });
  };
};
