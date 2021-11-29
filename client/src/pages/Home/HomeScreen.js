import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Layout } from '../../components/layout/Layout';
import { HomeBuyer } from '../../components/home/HomeBuyer';
import { HomeSeller } from '../../components/home/HomeSeller';
import { HomeAdmin } from '../../components/home/HomeAdmin';
import { getNotes } from '../../actions/notes';

export const HomeScreen = ({ contract, account }) => {
  const dispatch = useDispatch();
  const { role } = useSelector(state => state.auth);

  useEffect(() => {
    if (contract !== null && account !== '' && role !== 'admin') {
      dispatch(getNotes(contract, account));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
