import { types } from '../types/types';

const initialState = {
  notes: null,
  noteActive: null,
  notesBought: null,
  notesUploaded: null,
  status: types.idle
};

export const notesReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.notesLoading:
      return {
        status: types.loading
      };
    case types.setNotes:
      return {
        notes: action.payload,
        status: types.completed
      };
    case types.setNotesBought:
      return {
        ...state,
        notesBought: action.payload,
        status: types.completed
      };
    case types.setNoteActive:
      console.log(action.payload);
      return {
        ...state,
        noteActive: state.notes.filter(
          item => item.noteHash === action.payload
        )[0],
        status: types.completed
      };

    default:
      return state;
  }
};
