import React, { useState } from 'react';
import { useHistory } from 'react-router';
import IPFSGatewayTools from '@pinata/ipfs-gateway-tools/dist/browser';
import axios from 'axios';

// import { Container } from 'react-bootstrap';
// import CompInteractionCard from './CompInteractionCard';
// import ConnectWalletModal from '../../components/ConnectWalletModal';
// import useWalletConnectionModal from '../../hooks/useWalletConnectionModal';

const Home = () => {
  const history = useHistory();

  const [fileUploaded, setFileUploaded] = useState(null);
  const gatewayTools = new IPFSGatewayTools();
  const pinataApiKey = process.env.REACT_APP_PINATA_API_KEY;
  const pinataSecretApiKey = process.env.REACT_APP_PINATA_SECRET_API_KEY;

  const retrieveFile = e => {
    const data = e.target.files[0];
    setFileUploaded(e.target.files[0]);
    // const reader = new window.FileReader();
    // reader.readAsArrayBuffer(data);
    // reader.onloadend = () => {
    //   console.log('Buffer data: ', Buffer(reader.result));
    //   console.log(Buffer(reader.result));
    //   setFileUploaded(Buffer(reader.result));
    //   uploadFilePinata();
    // };

    e.preventDefault();
    // testAuthentication();
  };

  const testAuthentication = () => {
    const url = `https://api.pinata.cloud/data/testAuthentication`;
    return axios
      .get(url, {
        headers: {
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey
        }
      })
      .then(function (response) {
        //handle your response here
      })
      .catch(function (error) {
        //handle error here
      });
  };

  const uploadFilePinata = () => {
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
        //handle response here
      })
      .catch(function (error) {
        //handle error here
      });
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log('ohhh');
    uploadFilePinata();
  };

  // const { isWalletConnectModalOpen } = useWalletConnectionModal();
  const notes = [
    {
      id: 1,
      name: 'Auxilio judicial',
      url: ''
    },
    {
      id: 2,
      name: 'Técnico de hacienda',
      url: ''
    }
  ];
  return (
    // <Container className="mt-5">
    //   {isWalletConnectModalOpen && <ConnectWalletModal />}
    //   <CompInteractionCard />
    // </Container>
    <div>
      <div className="notes__container">
        {notes.map((note, i) => (
          <div
            className="note"
            key={i}
            onClick={() => history.push(`/note/${note.id}`)}>
            <p>{note.name}</p>
          </div>
        ))}
        <div className="App">
          <form className="form" onSubmit={handleSubmit}>
            <input type="file" name="data" onChange={retrieveFile} />
            <button type="submit" className="btn">
              Upload file
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
