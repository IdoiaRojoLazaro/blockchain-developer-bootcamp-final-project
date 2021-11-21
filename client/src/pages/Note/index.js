import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Layout } from '../../components/layout/Layout';

export const Note = ({ contract, account }) => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const { role } = useSelector(state => state.auth);
  const { notes } = useSelector(state => state.notes);

  const handleBuy = () => {
    console.log(contract);
    console.log(account);
  };

  useEffect(() => {
    if (notes !== null) {
      console.log(id);
      setNote(notes.filter(item => parseInt(item['id']) == id)[0]);
      console.log(notes);
      console.log(notes.filter(item => parseInt(item['id']) == id)[0]);
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
                  <button onClick={handleBuy}>Buy</button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};
