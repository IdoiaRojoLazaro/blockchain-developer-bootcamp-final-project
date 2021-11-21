import { types } from '../types/types';

const initialState = {
  notes: null
};

export const notesReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.setNotes:
      return {
        notes: action.payload
      };

    default:
      return state;
  }
};
