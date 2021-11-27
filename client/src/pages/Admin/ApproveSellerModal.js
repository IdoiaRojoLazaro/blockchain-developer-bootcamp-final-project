import React, { useState } from 'react';
import { useToasts } from 'react-toast-notifications';

import Modal from 'react-modal';
import ButtonSubmit from '../../components/shared/ButtonSubmit';

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

export const ApproveSellerModal = ({ show, setShow, contract, account }) => {
  const { addToast } = useToasts();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [accountSeller, setAccountSeller] = useState('');

  const handleChange = ({ target }) => {
    setAccountSeller(target.value);
  };

  const closeModal = () => {
    setShow(false);
  };

  const handleSubmitForm = e => {
    e.preventDefault();
    setLoadingSubmit(true);
    let response = contract.methods
      .approveSeller(accountSeller)
      .send({ from: account });
    response
      .then(txn => {
        console.log('txn seller approved: ', txn);
        if (txn.status && txn.events.UserSellerApproved) {
          addToast('Seller approved successfully', {
            appearance: 'success',
            autoDismiss: true
          });
          setLoadingSubmit(false);
          closeModal();
        }
      })
      .catch(err => {
        setLoadingSubmit(false);
        addToast('There was an error', {
          appearance: 'warning',
          autoDismiss: true
        });
      });
  };

  return (
    <Modal
      isOpen={show}
      onRequestClose={closeModal}
      style={customStyles}
      closeTimeoutMS={200}
      className="modal"
      overlayClassName="modal-fondo">
      <form className="container" onSubmit={handleSubmitForm}>
        <div className="modal__header">
          <h3>Approve seller</h3>
        </div>
        <div className="modal__body">
          <div className="form-group">
            <label>Account seller</label>
            <input
              autoComplete="off"
              name="title"
              onChange={handleChange}
              required
              type="text"
              value={accountSeller}
            />
          </div>
        </div>

        <div className="modal__footer">
          <ButtonSubmit loadingSubmit={loadingSubmit} />
        </div>
      </form>
    </Modal>
  );
};
