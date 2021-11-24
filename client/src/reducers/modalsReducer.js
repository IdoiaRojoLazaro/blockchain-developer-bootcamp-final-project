import { types } from '../types/types';

const initialState = {
  approveSellerModalOpen: false
};
export const modalsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.openModalAS:
      return {
        approveSellerModalOpen: true
      };
    case types.closeModalAS:
      return {
        approveSellerModalOpen: false
      };

    default:
      return state;
  }
};
