import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNotes, getMyPurchasedNotes } from '../../actions/notes';

import { types } from '../../types/types';

import { Loading } from '../../components/shared/Loading';
import { NotesIndex } from '../../components/notes/NotesIndex';

export const HomeBuyer = ({ contract }) => {
  const dispatch = useDispatch();

  const [filterActive, setFilterActive] = useState('');
  const { account } = useSelector((state) => state.auth);
  const { notes, notesBought, status } = useSelector((state) => state.notes);

  const handleFilter = (e, filter) => {
    e.preventDefault();
    setFilterActive(filter);
    refreshNotes(filter);
  };

  const refreshNotes = (filter) => {
    if (filter === '') {
      dispatch(getNotes(contract, account));
    } else {
      dispatch(getMyPurchasedNotes(contract, account));
    }
  };

  return (
    <>
      <div className="header-tab-filters">
        <h4
          className={filterActive === '' ? 'active' : ''}
          onClick={(e) => handleFilter(e, '')}
        >
          All notes
        </h4>
        {'|'}
        <h4
          className={filterActive === 'bought' ? 'active' : ''}
          onClick={(e) => handleFilter(e, 'bought')}
        >
          Notes bought
        </h4>
      </div>
      <div className="notes__container">
        {status === types.loading && notes !== null && notesBought !== null ? (
          <Loading />
        ) : (
          <>
            <NotesIndex filterActive={filterActive} contract={contract} />
          </>
        )}
      </div>
    </>
  );
};
