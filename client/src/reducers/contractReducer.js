import { types } from '../types/types';

const initialState = {
  contract: null
};

export const contractReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.setContract:
      return {
        contract: action.payload
      };

    default:
      return state;
  }
};
