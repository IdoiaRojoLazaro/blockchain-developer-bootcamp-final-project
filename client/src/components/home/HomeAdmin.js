import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export const HomeAdmin = ({ contract, account }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (contract !== null && account !== '') {
      dispatch(getUploadedNotes(contract, account));
    }
  }, []);
  return <div></div>;
};
