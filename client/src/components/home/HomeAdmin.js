import { CheckCircle, Flashlight, Warning } from 'phosphor-react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from '../../actions/users';
import { types } from '../../types/types';
import {
  swalConnectionMetamask,
  swalWaitingTxn,
  swalSuccess
} from '../../utils/generalFunctions';
import { Loading } from '../shared/Loading';

export const HomeAdmin = ({ contract, account }) => {
  const dispatch = useDispatch();
  const { users, status } = useSelector(state => state.users);
  const columns = ['Address', 'Role', 'Approve to sell'];

  useEffect(() => {
    if (contract !== null && account !== '') {
      dispatch(getUsers(contract, account));
    }
  }, []);

  const handleApprove = accountSeller => {
    swalConnectionMetamask();

    let response = contract.methods
      .approveSeller(accountSeller)
      .send({ from: account });
    response.on('transactionHash', function (hash) {
      console.log(' ----- transactionHash ------');
      console.log(hash);
      swalWaitingTxn();
    });
    response.on('confirmation', function (confirmationNumber, receipt) {
      console.log(' ----- confirmationNumber, receipt ------');
      console.log(confirmationNumber, receipt);
      swalSuccess('Seller approved successfully');
    });
  };
  return (
    <div>
      {status === types.loading ? (
        <Loading />
      ) : (
        <>
          {users !== null && users.length > 0 ? (
            <table className="table table__custom">
              <thead className="table-head">
                <tr>
                  {columns.map((c, index) => (
                    <td key={index}>{c}</td>
                  ))}
                </tr>
              </thead>
              <tbody className="table-body">
                {users.map((user, i) => (
                  <tr key={i}>
                    {columns.map((c, index) => {
                      switch (c) {
                        case 'Address':
                          return <td key={index}>{user.userAddr}</td>;
                        case 'Role':
                          return (
                            <td key={index}>
                              {user.seller ? 'Seller' : 'Buyer'}
                            </td>
                          );
                        case 'Approve to sell':
                          return (
                            <td key={index}>
                              {user.seller ? (
                                user.isSellerApproved ? (
                                  <button className="btn">
                                    <CheckCircle size={10} /> Approved
                                  </button>
                                ) : (
                                  <button
                                    className="btn btn-warning"
                                    onClick={e =>
                                      handleApprove(e, user.userAddr)
                                    }>
                                    <Warning size={10} />
                                    Pending approve
                                  </button>
                                )
                              ) : (
                                '-'
                              )}
                            </td>
                          );
                      }
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-results">
              <Flashlight size={48} />
              <h3>No results found</h3>

              <p>No user has yet registered.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
