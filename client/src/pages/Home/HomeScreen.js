import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Layout } from '../../components/layout/Layout';
import { ApproveSellerModal } from '../Admin/ApproveSellerModal';
import { HomeBuyer } from '../../components/home/HomeBuyer';
import { HomeSeller } from '../../components/home/HomeSeller';
import { HomeAdmin } from '../../components/home/HomeAdmin';
import { getNotes } from '../../actions/notes';

export const HomeScreen = ({ contract, account }) => {
  const dispatch = useDispatch();
  const { role } = useSelector(state => state.auth);

  const [show, setShow] = useState(false);
  const { approveSellerModalOpen } = useSelector(state => state.modals);

  useEffect(() => {
    if (approveSellerModalOpen) {
      setShow(approveSellerModalOpen);
    }
  }, [approveSellerModalOpen]);

  useEffect(() => {
    if (contract !== null && account !== '' && role !== 'admin') {
      dispatch(getNotes(contract, account));
    }
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
