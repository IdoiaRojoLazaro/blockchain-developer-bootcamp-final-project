import { types } from '../types/types';

export const getNotes = (contract, account) => {
  return async dispatch => {
    dispatch({ type: types.notesLoading });
    const resp = await contract.methods.getAllNotes().call({ from: account });
    if (resp) {
      console.log(resp);
      dispatch({
        type: types.setNotes,
        payload: resp
      });
      return 'hola';
    }
    // .then(res => {
    //   console.log(res);
    //   dispatch({
    //     type: types.setNotes,
    //     payload: res
    //   });
    //   return 'hola';
    // })
    // .catch(error => false);
  };
};

export const getMyPurchasedNotes = (contract, account) => {
  return async dispatch => {
    dispatch({ type: types.notesLoading });
    contract.methods
      .getMyPurchasedNotes()
      .call({ from: account })
      .then(res => {
        console.log(res);
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
        console.log('çççççççç res');
        console.log(res);
        if (res.lenth[0] > 0) {
          dispatch({
            type: types.setUploadedNotes,
            payload: res
          });
        }
      });
  };
};
