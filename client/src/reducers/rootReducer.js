import { combineReducers } from 'redux';
import { authReducer } from './authReducer';
import { homeReducer } from './homeReducer';
import { graphicsTimeZoneReducer } from './graphicsTimeZoneReducer';
import { combineReducers } from 'redux';
import { authReducer } from './authReducer';

export const rootReducer = combineReducers({
  auth: authReducer
});
