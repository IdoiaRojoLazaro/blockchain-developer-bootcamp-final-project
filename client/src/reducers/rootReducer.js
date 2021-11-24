import { combineReducers } from 'redux';
import { authReducer } from './authReducer';
import { modalsReducer } from './modalsReducer';
import { notesReducer } from './notesReducer';

export const rootReducer = combineReducers({
  auth: authReducer,
  modals: modalsReducer,
  notes: notesReducer
});
