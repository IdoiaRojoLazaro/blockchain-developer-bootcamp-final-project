import { combineReducers } from 'redux';
import { authReducer } from './authReducer';
import { notesReducer } from './notesReducer';
import { usersReducer } from './usersReducer';

export const rootReducer = combineReducers({
  auth: authReducer,
  notes: notesReducer,
  users: usersReducer
});
