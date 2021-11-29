import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { getNotes } from '../../actions/notes';
import { getBytes32FromIpfsHash } from '../../utils/ipfsHashHelper';
import {
  swalConnectionMetamask,
  swalWaitingTxn,
  swalError
} from '../../utils/swalFires';

import axios from 'axios';
import Swal from 'sweetalert2';
import Modal from 'react-modal';

import ButtonSubmit from '../shared/ButtonSubmit';
import { Warning } from 'phosphor-react';

const { utils } = require('ethers');

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
      let IPFShash = getBytes32FromIpfsHash(res);

      swalConnectionMetamask();
      let response = contract.methods
        .addNote(IPFShash, title, description, author, utils.parseEther(price))
        .send({ from: account });

      response.on('error', function () {
        swalError('You must accept the transaction on metamask to continue');
      });
      response.on('transactionHash', function (hash) {
        swalWaitingTxn();
      });

      response
        .then(txn => {
          if (txn.status && txn.events.NoteAdded) {
            Swal.fire({
              icon: 'success',
              title: 'The note has successfully uploaded'
            }).then(() => dispatch(getNotes(contract, account)));

            closeModal();
          }
        })
        .catch(() => {
          swalError('There was an error during transaction');
          closeModal();
        });
    });
  };

  const uploadFilePinata = () => {
    const pinataApiKey = process.env.REACT_APP_PINATA_API_KEY;
    const pinataSecretApiKey = process.env.REACT_APP_PINATA_SECRET_API_KEY;
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    let formData = new FormData();
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
            <label>Price (eth)</label>
            <input
              autoComplete="off"
              name="price"
              onChange={handleInputChange}
              required
              type="number"
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
          <p className="warning">
            <Warning size={18} />
            Commission is 10% of the price for the platform
          </p>
        </div>

        <div className="modal__footer">
          <ButtonSubmit loadingSubmit={loadingSubmit} />
        </div>
      </form>
    </Modal>
  );
};
