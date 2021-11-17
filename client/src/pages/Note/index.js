import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { notesList } from '../../jsons/jsons';

export const Note = () => {
  const { id } = useParams();
  const listNotes = notesList;
  const [note, setNote] = useState(null);

  useEffect(() => {
    console.log(id);
    setNote(listNotes.filter(item => item.id == id)[0]);
    console.log(listNotes);
    console.log(listNotes.filter(item => item.id == id)[0]);
  }, [id]);

  return (
    <div>
      <div>
        {note && (
          <>
            <img src={note.url} alt={note.name} />
            <div>
              <p>${note.price}</p>
              <p>{note.name}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
