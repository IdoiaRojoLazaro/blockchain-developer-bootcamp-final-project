import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Layout } from '../../components/layout/Layout';
import { ApproveSellerModal } from '../Admin/ApproveSellerModal';
import { HomeBuyer } from '../../components/home/HomeBuyer';
import { HomeSeller } from '../../components/home/HomeSeller';
import { HomeAdmin } from '../../components/home/HomeAdmin';

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
    console.log('me he suscrito al pasado??');
    contract.events
      .allEvents({ fromBlock: 'latest' })
      .on('data', console.log)
      .on('changed', console.log)
      .on('error', console.log);

    // var options = {
    //   fromBlock: 0,
    //   address: web3.eth.defaultAccount,
    //   topics: [
    //     '0x0000000000000000000000000000000000000000000000000000000000000000',
    //     null,
    //     null
    //   ]
    // };
    // web3.eth
    //   .subscribe('logs', options, function (error, result) {
    //     if (!error) console.log(result);
    //   })
    //   .on('data', function (log) {
    //     console.log(log);
    //   })
    //   .on('changed', function (log) {});
  }, []);

  return (
    <Layout>
      <div>
        {role === 'buyer' && (
          <HomeBuyer contract={contract} account={account} />
        )}
        {role === 'seller' && (
          <HomeSeller contract={contract} account={account} />
        )}

        {role === 'admin' && (
          <>
            <HomeAdmin contract={contract} account={account} />
            <ApproveSellerModal
              show={show}
              setShow={setShow}
              contract={contract}
              account={account}
            />
          </>
        )}
      </div>
    </Layout>
  );
};
