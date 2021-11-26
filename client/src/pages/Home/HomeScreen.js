import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Layout } from '../../components/layout/Layout';
import { ApproveSellerModal } from '../Admin/ApproveSellerModal';

import axios from 'axios';
import { HomeBuyer } from '../../components/home/HomeBuyer';
import { HomeSeller } from '../../components/home/HomeSeller';

export const HomeScreen = ({ contract, account }) => {
  const { role } = useSelector(state => state.auth);

  const [show, setShow] = useState(false);
  const { approveSellerModalOpen } = useSelector(state => state.modals);

  useEffect(() => {
    if (approveSellerModalOpen) {
      setShow(approveSellerModalOpen);
    }
  }, [approveSellerModalOpen]);

  useEffect(() => {
    //let eventsPast = contract.events.getPastEvents('UserCreated');
    // let events = contract.events.allEvents();
    // console.log(events);
    console.log('me he suscrito??');
    const events = contract.events.allEvents({ address: account }); // get all events
    events.on('connected', function (subId) {
      console.log(subId);
    });
    events.on('data', function (event) {
      console.log(event);
    });
    console.log('me he suscripto al pasado??');
    contract.events
      .allEvents({ fromBlock: 'latest' })
      .on('data', console.log)
      .on('changed', console.log)
      .on('error', console.log);
  }, []);

  const loadBoughtNotes = () => {
    //dispatch(getMyPurchasedNotes(contract, account));

    return axios
      .get(
        'https://ipfs.io/ipfs/QmaNxbQNrJdLzzd8CKRutBjMZ6GXRjvuPepLuNSsfdeJRJ'
      )
      .then(blob => {
        console.log(blob);
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `FileName.pdf`);

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        link.parentNode.removeChild(link);
      });
  };

  return (
    <Layout>
      <div>
        {role == 'buyer' && <HomeBuyer contract={contract} account={account} />}
        {role === 'seller' && (
          <HomeSeller contract={contract} account={account} />
        )}

        {role === 'admin' && (
          <ApproveSellerModal
            show={show}
            setShow={setShow}
            contract={contract}
            account={account}
          />
        )}
      </div>
    </Layout>
  );
};
