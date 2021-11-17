import React, { useState } from 'react';
import IPFSGatewayTools from '@pinata/ipfs-gateway-tools/dist/browser';
import axios from 'axios';

import Modal from 'react-modal';
import ButtonSubmit from '../../components/shared/ButtonSubmit';
import { getBytes32FromIpfsHash } from '../../utils/ipfsHashHelper';

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
  price: '',
  commission: ''
};

export const NoteNewModal = ({ show, setShow, contract, account }) => {
  const [formValues, setFormValues] = useState(initInfo);
  const [fileUploaded, setFileUploaded] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const { title, author, price, commission } = formValues;
  console.log(account);

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
        .addNote(IPFShash, title, author, price, commission)
        .send({ from: account });
      response.then(result => {
        console.log('add book: ', result);
      });
    });
    //closeModal();
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
    //pinataOptions are optional
    const pinataOptions = JSON.stringify({
      cidVersion: 0,
      customPinPolicy: {
        regions: [
          {
            id: 'FRA1',
            desiredReplicationCount: 1
          },
          {
            id: 'NYC1',
            desiredReplicationCount: 2
          }
        ]
      }
    });
    formData.append('pinataOptions', pinataOptions);

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
        console.log(response);
        let IpfsHash = response.data.IpfsHash;
        console.log(IpfsHash);
        return IpfsHash;
        //handle response here
      })
      .catch(function (error) {
        //handle error here
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
            <label>Commission</label>
            <input
              autoComplete="off"
              name="commission"
              onChange={handleInputChange}
              required
              type="text"
              value={commission}
            />
          </div>
          <div className="form-group">
            <input type="file" name="data" onChange={retrieveFile} />
          </div>
        </div>

        <div className="modal__footer">
          <ButtonSubmit loadingSubmit={loadingSubmit} />
        </div>
      </form>
    </Modal>
  );
};
