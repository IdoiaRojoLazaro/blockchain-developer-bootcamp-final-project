import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getIpfsHashFromBytes32 } from '../../utils/ipfsHashHelper';
import { Flashlight } from 'phosphor-react';
import { NoteShowModal } from './NoteShowModal';
import { types } from '../../types/types';
import { noteIsBought } from '../../utils/generalFunctions';
const { utils } = require('ethers');

export const NotesIndex = ({ filterActive, contract }) => {
  const { role } = useSelector((state) => state.auth);
  const { notes, notesBought, notesUploaded } = useSelector(
    (state) => state.notes
  );
  const dispatch = useDispatch();
  const [showNoteModal, setShowNoteModal] = useState(false);

  const handleClick = (e, noteHash) => {
    if (filterActive !== 'bought') {
      e.preventDefault();
      setShowNoteModal(true);
      dispatch({
        type: types.setNoteActive,
        payload: noteHash
      });
    }
  };
  return (
    <>
      {notes !== null &&
      (notesBought !== null || notesUploaded !== null) &&
      notes.length > 0 &&
      (filterActive !== 'bought' || notesBought.length > 0) ? (
        role === 'seller' ? (
          notesUploaded.map((note, i) => (
            <div
              className={`note`}
              key={i}
              onClick={(e) => handleClick(e, note['noteHash'])}
            >
              <p className="title">{note['title']}</p>
              <p>{note['author']}</p>
              <p className="price">{utils.formatEther(note['price'])}eth</p>
              <p className="purchase-count">
                Purchased: {note['purchaseCount']}
              </p>
            </div>
          ))
        ) : (
          notes.map(
            (note, i) =>
              (filterActive !== 'bought' ||
                noteIsBought(note, notesBought)) && (
                <div
                  className={`note ${
                    filterActive === 'bought' ? 'bought' : ''
                  } ${noteIsBought(note, notesBought) ? 'already-bought' : ''}`}
                  key={i}
                  onClick={(e) => handleClick(e, note['noteHash'])}
                >
                  <p className="title">{note['title']}</p>
                  <p>{note['author']}</p>
                  <p className="price">{utils.formatEther(note['price'])}eth</p>
                  <p className="purchase-count">
                    Purchased: {note['purchaseCount']}
                  </p>
                  {noteIsBought(note, notesBought) && (
                    <a
                      href={`https://ipfs.io/ipfs/${getIpfsHashFromBytes32(
                        note['IPFSHash']
                      )}`}
                      className="btn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      See
                    </a>
                  )}
                </div>
              )
          )
        )
      ) : (
        <div className="no-results">
          <Flashlight size={48} />
          <h3>No results found</h3>
          <p>
            {role === 'seller'
              ? 'You have not uploaded any notes yet'
              : 'We are sorry but there is no note available to buy.'}
          </p>
        </div>
      )}

      <NoteShowModal
        show={showNoteModal}
        setShow={setShowNoteModal}
        contract={contract}
      />
    </>
  );
};
