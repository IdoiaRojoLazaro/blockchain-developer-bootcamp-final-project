import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Layout } from '../../components/layout/Layout';
import { HomeBuyer } from '../../components/home/HomeBuyer';
import { HomeSeller } from '../../components/home/HomeSeller';
import { HomeAdmin } from '../../components/home/HomeAdmin';
import { getNotes } from '../../actions/notes';

export const HomeScreen = ({ contract, account }) => {
  const dispatch = useDispatch();
  const { role } = useSelector(state => state.auth);

  const [show, setShow] = useState(false);

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
          </>
        )}
      </div>
    </Layout>
  );
};
