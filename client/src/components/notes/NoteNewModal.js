import React, { useState } from 'react';
import axios from 'axios';

import Modal from 'react-modal';
import ButtonSubmit from '../shared/ButtonSubmit';
import { getBytes32FromIpfsHash } from '../../utils/ipfsHashHelper';
import { useToasts } from 'react-toast-notifications';
import Swal from 'sweetalert2';
import { getNotes } from '../../actions/notes';
import { useDispatch } from 'react-redux';

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

const initInfo = {
  title: '',
  author: '',
  description: '',
  price: ''
};

export const NoteNewModal = ({ show, setShow, contract, account }) => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const [formValues, setFormValues] = useState(initInfo);
  const [fileUploaded, setFileUploaded] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const { title, description, author, price } = formValues;

  const retrieveFile = e => {
    e.preventDefault();
    setFileUploaded(e.target.files[0]);
  };

  const handleInputChange = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value
    });
  };

  const closeModal = () => setShow(false);

  const handleSubmitForm = e => {
    e.preventDefault();
    setLoadingSubmit(true);
    uploadFilePinata().then(res => {
      console.log(res);

      let IPFShash = getBytes32FromIpfsHash(res);
      let response = contract.methods
        .addNote(IPFShash, title, description, author, price)
        .send({ from: account });
      response
        .then(txn => {
          console.log('txn note added: ', txn);
          if (txn.status && txn.events.NoteAdded) {
            addToast('The note has successfully uploaded', {
              appearance: 'success',
              autoDismiss: true
            });
            dispatch(getNotes(contract, account));
            closeModal();
          }
        })
        .catch(err => {
          console.log(err);
          addToast('There was an error', {
            appearance: 'error',
            autoDismiss: true
          });
          closeModal();
        });
    });
  };

  const uploadFilePinata = () => {
    const pinataApiKey = process.env.REACT_APP_PINATA_API_KEY;
    const pinataSecretApiKey = process.env.REACT_APP_PINATA_SECRET_API_KEY;
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    let formData = new FormData();
    console.log('fileUploaded');
    console.log(fileUploaded);
    formData.append('file', fileUploaded);
    const metadata = JSON.stringify({
      name: 'testname',
      keyvalues: {
        exampleKey: 'exampleValue'
      }
    });
    formData.append('pinataMetadata', metadata);
    return axios
      .post(url, formData, {
        maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
        headers: {
          'Content-Type': `multipart/form-data;`,
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey
        }
      })
      .then(function (response) {
        let IpfsHash = response.data.IpfsHash;
        return IpfsHash;
      })
      .catch(function (error) {
        console.log(error);
        Swal.fire('Error', error, 'error');
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
          <h3>Upload new note</h3>
        </div>
        <div className="modal__body">
          <div className="form-group">
            <label>Title</label>
            <input
              autoComplete="off"
              name="title"
              onChange={handleInputChange}
              required
              type="text"
              value={title}
            />
          </div>
          <div className="form-group">
            <label>Author</label>
            <input
              autoComplete="off"
              name="author"
              onChange={handleInputChange}
              required
              type="text"
              value={author}
            />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              autoComplete="off"
              name="price"
              onChange={handleInputChange}
              required
              type="text"
              value={price}
            />
          </div>
          <div className="form-group">
            <label>File (note)</label>
            <input type="file" name="data" required onChange={retrieveFile} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              autoComplete="off"
              name="description"
              onChange={handleInputChange}
              required
              defaultValue={description}></textarea>
          </div>
        </div>

        <div className="modal__footer">
          <ButtonSubmit loadingSubmit={loadingSubmit} />
        </div>
      </form>
    </Modal>
  );
};
