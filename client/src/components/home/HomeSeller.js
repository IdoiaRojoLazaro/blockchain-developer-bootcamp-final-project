import { Alarm, Warning } from 'phosphor-react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { types } from '../../types/types';
import { NoteNewModal } from '../notes/NoteNewModal';
import { NotesIndex } from '../notes/NotesIndex';
import { Loading } from '../shared/Loading';

export const HomeSeller = ({ contract, account }) => {
  const [newNoteModal, setNewNoteModal] = useState(false);
  const { approveToSell } = useSelector(state => state.auth);
  const { notesUploaded, status } = useSelector(state => state.notes);

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
        {status === types.loading ? (
          <Loading />
        ) : (
          <>
            <NotesIndex
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
