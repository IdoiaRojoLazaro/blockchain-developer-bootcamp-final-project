import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { NoteNewModal } from '../Note/NoteNewModal';
import { Layout } from '../../components/layout/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { types } from '../../types/types';

const Home = ({ contract, account }) => {
  const dispatch = useDispatch();

  const history = useHistory();
  const { role } = useSelector(state => state.auth);
  const [newNoteModal, setNewNoteModal] = useState(false);
  const { notes } = useSelector(state => state.notes);

  useEffect(() => {
    if (contract !== null && account !== '') {
      contract.methods
        .getAllNotes()
        .call({ from: account })
        .then(res => {
          console.log(res);
          dispatch({
            type: types.setNotes,
            payload: res
          });
        });
    }
  }, []);

  const handleClick = (e, id) => {
    e.preventDefault();
    history.push(`/note/${id}`);
  };

  return (
    <Layout>
      <div>
        {role === 'seller' && (
          <p className="text-right">
            <button className="btn" onClick={() => setNewNoteModal(true)}>
              Add new note
            </button>
          </p>
        )}

        <div className="notes__container">
          {notes !== null &&
            notes.map((note, i) => (
              <div
                className="note"
                key={i}
                onClick={e => handleClick(e, note['id'])}>
                <p className="title">{note['title']}</p>
                <p>{note['author']}</p>
                <p className="price">{note['price']}eth</p>
              </div>
            ))}

          <NoteNewModal
            show={newNoteModal}
            setShow={setNewNoteModal}
            contract={contract}
            account={account}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Home;
