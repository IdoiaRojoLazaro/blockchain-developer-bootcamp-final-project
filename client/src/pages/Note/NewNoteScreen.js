import React, { useState } from 'react';
import { create } from 'ipfs-http-client';

export const NewNoteScreen = () => {
  const [file, setFile] = useState(null);
  const [urlArr, setUrlArr] = useState([]);

  const retrieveFile = e => {
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      console.log('Buffer data: ', Buffer(reader.result));
      setFile(Buffer(reader.result));
    };

    e.preventDefault();
  };
  const client = create('https://ipfs.infura.io:5001/api/v0');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const created = await client.add(file);
      const url = `https://ipfs.infura.io/ipfs/${created.path}`;
      setUrlArr(prev => [...prev, url]);
      console.log(url);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      <div className="App">
        <form className="form" onSubmit={handleSubmit}>
          <input type="file" name="data" onChange={retrieveFile} />
          <button type="submit" className="btn">
            Upload file
          </button>
        </form>
      </div>
      <div className="display">
        {urlArr.length !== 0 ? (
          urlArr.map((el, i) => (
            <div key={i}>
              <p>{el}</p>
              <img src={el} alt="nfts" />
            </div>
          ))
        ) : (
          <h3>Upload data</h3>
        )}
      </div>
    </div>
  );
};
