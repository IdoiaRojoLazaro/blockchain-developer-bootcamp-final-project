import { combineReducers } from 'redux';
import { authReducer } from './authReducer';
import { contractReducer } from './contractReducer';
import { notesReducer } from './notesReducer';

export const rootReducer = combineReducers({
  auth: authReducer,
  contract: contractReducer,
  notes: notesReducer
});
