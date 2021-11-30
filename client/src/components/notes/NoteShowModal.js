import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  swalConnectionMetamask,
  swalWaitingTxn,
  swalError
} from '../../utils/swalFires';

import Swal from 'sweetalert2';
import Modal from 'react-modal';
import ButtonSubmit from '../shared/ButtonSubmit';
import { Loading } from '../shared/Loading';
import { FilePdf } from 'phosphor-react';
import { getBalance } from '../../utils/connectToWeb3';
import { types } from '../../types/types';
import { noteIsBought } from '../../utils/generalFunctions';
import { getIpfsHashFromBytes32 } from '../../utils/ipfsHashHelper';

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

export const NoteShowModal = ({ show, setShow, contract }) => {
  const dispatch = useDispatch();

  const { noteActive, notesBought } = useSelector((state) => state.notes);
  const { account, role } = useSelector((state) => state.auth);

  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const closeModal = () => setShow(false);

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    let balanceAct = await getBalance();

    if (balanceAct < noteActive.price) {
      swalError(
        'Add some credit to your wallet and refresh the page',
        'Insufficient funds to buy the note'
      );
    } else {
      setLoadingSubmit(true);
      let response = contract.methods.buyNote(noteActive.noteHash).send({
        from: account,
        value: noteActive.price
      });

      swalConnectionMetamask();
      response.on('error', function () {
        swalError('You must accept the transaction on metamask to continue');
      });
      response.on('transactionHash', function () {
        swalWaitingTxn();
      });

      response
        .then((txn) => {
          if (txn.status && txn.events.NoteBought) {
            Swal.fire({
              icon: 'success',
              title: 'Note bought successfully',
              text: 'You can check it on the Notes Bought tab'
            }).then(() => {
              closeModal();
              setLoadingSubmit(false);
              getBalance().then((balanceNew) => {
                dispatch({
                  type: types.authUpdateBalance,
                  payload: balanceNew
                });
              });
            });
          }
        })
        .catch((err) => {
          swalError('There was an error during transaction');
          setLoadingSubmit(false);
        });
    }
  };

  return (
    <Modal
      isOpen={show}
      onRequestClose={closeModal}
      style={customStyles}
      closeTimeoutMS={200}
      className="modal modal-show-note"
      overlayClassName="modal-fondo"
    >
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
              <p>Units purchased: {noteActive['purchaseCount']}</p>
            </div>
            {role === 'buyer' && (
              <div className="modal__footer">
                {noteIsBought(noteActive, notesBought) ? (
                  <a
                    href={`https://ipfs.io/ipfs/${getIpfsHashFromBytes32(
                      noteActive['IPFSHash']
                    )}`}
                    className="btn btn-fill"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open file
                  </a>
                ) : (
                  <ButtonSubmit
                    loadingSubmit={loadingSubmit}
                    text={'buy'}
                    classNameBtn="btn-fill"
                  />
                )}
              </div>
            )}
          </>
        ) : (
          <Loading />
        )}
      </form>
    </Modal>
  );
};
