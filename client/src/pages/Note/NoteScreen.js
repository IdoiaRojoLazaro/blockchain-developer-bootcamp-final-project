import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router';
import { useToasts } from 'react-toast-notifications';
import { Layout } from '../../components/layout/Layout';

export const NoteScreen = ({ contract, account }) => {
  const { id } = useParams();
  const history = useHistory();
  const [note, setNote] = useState(null);
  const { role, balance } = useSelector(state => state.auth);
  const { notes } = useSelector(state => state.notes);
  const { addToast } = useToasts();

  useEffect(() => {
    if (notes === null) {
      history.push('/');
    }
  }, []);

  const handleBuy = (e, noteHash) => {
    e.preventDefault();
    let response = contract.methods.buyNote(noteHash).send({
      from: account,
      value: parseInt(balance)
    });
    response.then(txn => {
      console.log('Note bought: ', txn);
      if (txn.status && txn.events.NoteBought) {
        addToast('Note bought successfully', {
          appearance: 'success',
          autoDismiss: true
        });
      }
    });
  };

  useEffect(() => {
    if (notes !== null) {
      setNote(notes.filter(item => parseInt(item['id']) == id)[0]);
    }
  }, [id]);

  return (
    <Layout>
      <div>
        <div>
          {note && (
            <>
              <div>
                <p>{note.price} eth</p>
                <p>owner: {note.owner}</p>
                {role === 'buyer' && account !== note.owner && (
                  <button
                    className="btn"
                    onClick={e => handleBuy(e, note.noteHash)}>
                    Buy
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};
