import { types } from '../types/types';

export const getNotes = (contract, account) => {
  return async dispatch => {
    dispatch({ type: types.notesLoading });
    contract.methods
      .getAllNotes()
      .call({ from: account })
      .then(res =>
        dispatch({
          type: types.setNotes,
          payload: res
        })
      )
      .catch(() => console.log('Err getting notes'));
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
      })
      .catch(() => console.log('Err getMyPurchasedNotes'));
  };
};

export const getUploadedNotes = (contract, account) => {
  return async dispatch => {
    dispatch({ type: types.notesLoading });
    contract.methods
      .getMyUploadedNotes()
      .call({ from: account })
      .then(res => {
        dispatch({
          type: types.setUploadedNotes,
          payload: res
        });
      })
      .catch(() => console.log('Err getUploadedNotes'));
  };
};
