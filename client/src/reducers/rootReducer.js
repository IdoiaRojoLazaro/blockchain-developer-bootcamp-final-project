import { combineReducers } from 'redux';
import { authReducer } from './authReducer';
import { modalsReducer } from './modalsReducer';
import { notesReducer } from './notesReducer';
import { usersReducer } from './usersReducer';

export const rootReducer = combineReducers({
  auth: authReducer,
  modals: modalsReducer,
  notes: notesReducer,
  users: usersReducer
});
