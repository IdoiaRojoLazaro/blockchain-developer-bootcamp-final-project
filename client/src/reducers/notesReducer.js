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
        ...state,
        status: types.loading
      };
    case types.setNotes:
      return {
        ...state,
        notes: action.payload,
        status: types.completed
      };
    case types.setNotesBought:
      return {
        ...state,
        notesBought: state.notes.filter(item =>
          action.payload[0].includes(item.noteHash)
        ),
        status: types.completed
      };
    case types.setUploadedNotes:
      return {
        ...state,
        notesUploaded: action.payload,
        status: types.completed
      };
    case types.setNoteActive:
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
