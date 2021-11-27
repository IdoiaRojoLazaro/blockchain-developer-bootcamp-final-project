import { types } from '../types/types';

const initialState = {
  users: null,
  status: types.idle
};

export const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.usersLoading:
      return {
        ...state,
        status: types.loading
      };
    case types.setUsers:
      return {
        users: action.payload,
        status: types.completed
      };

    default:
      return state;
  }
};
