import React, { useState } from 'react';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import ButtonSubmit from '../shared/ButtonSubmit';
import { getBytes32FromIpfsHash } from '../../utils/ipfsHashHelper';
import { useToasts } from 'react-toast-notifications';
import { FilePdf } from 'phosphor-react';
import { Loading } from '../shared/Loading';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};
Modal.setAppElement('#root');

export const NoteShowModal = ({ show, setShow, contract, account }) => {
  const { addToast } = useToasts();
  const { noteActive } = useSelector(state => state.notes);
  const { balance } = useSelector(state => state.auth);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const closeModal = () => setShow(false);
  const handleSubmitForm = e => {
    e.preventDefault();
    setLoadingSubmit(true);
    let response = contract.methods.buyNote(noteActive.noteHash).send({
      from: account,
      value: parseInt(balance)
    });
    response
      .then(txn => {
        console.log('Note bought: ', txn);
        if (txn.status && txn.events.NoteBought) {
          addToast('Note bought successfully', {
            appearance: 'success',
            autoDismiss: true
          });
        }
      })
      .catch(err => {
        console.log(err);
        addToast('There was an error during transaction', {
          appearance: 'error',
          autoDismiss: true
        });
        setLoadingSubmit(false);
      });
  };

  if (noteActive && noteActive !== null) {
    console.log(noteActive);
  }
  return (
    <Modal
      isOpen={show}
      onRequestClose={closeModal}
      style={customStyles}
      closeTimeoutMS={200}
      className="modal modal-show-note"
      overlayClassName="modal-fondo">
      <form className="container" onSubmit={handleSubmitForm}>
        {noteActive && noteActive !== null ? (
          <>
            <div className="modal__body">
              <div className="pdf-icon">
                <FilePdf size={40} />
              </div>
              <h1>{noteActive['title']}</h1>
              <h3>{noteActive['author']}</h3>
              <p>{noteActive['description']}</p>
            </div>
            <div className="modal__footer">
              <ButtonSubmit
                loadingSubmit={loadingSubmit}
                text={'buy'}
                classNameBtn="btn-fill"
              />
            </div>
          </>
        ) : (
          <Loading />
        )}
      </form>
    </Modal>
  );
};
