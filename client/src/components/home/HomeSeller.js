import { Warning } from 'phosphor-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUploadedNotes } from '../../actions/notes';

import { types } from '../../types/types';
import { NoteNewModal } from '../notes/NoteNewModal';
import { NotesIndex } from '../notes/NotesIndex';
import { Loading } from '../shared/Loading';

export const HomeSeller = ({ contract, account }) => {
  const dispatch = useDispatch();
  const [newNoteModal, setNewNoteModal] = useState(false);
  const { approveToSell } = useSelector(state => state.auth);
  const { notesUploaded, status } = useSelector(state => state.notes);

  useEffect(() => {
    if (contract !== null && account !== '') {
      dispatch(getUploadedNotes(contract, account));
    }
  }, []);

  return (
    <>
      {approveToSell ? (
        <p className="text-right">
          <button className="btn" onClick={() => setNewNoteModal(true)}>
            Add new note
          </button>
        </p>
      ) : (
        <p className="warning">
          <Warning size={18} />
          You are not yet approved by the admin to sell
        </p>
      )}

      <div className="header-tab-filters">
        <h4 className="active">Notes created</h4>
      </div>
      <div className="notes__container">
        {status === types.loading && notesUploaded && notesUploaded !== null ? (
          <Loading />
        ) : (
          <>
            <NotesIndex
              filterActive={''}
              notes={notesUploaded}
              contract={contract}
              account={account}
            />

            {/* <button onClick={loadBoughtNotes}>cargar notes</button> */}
          </>
        )}
      </div>
      <NoteNewModal
        show={newNoteModal}
        setShow={setNewNoteModal}
        contract={contract}
        account={account}
      />
    </>
  );
};
