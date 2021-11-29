import { CheckCircle, Flashlight, Warning } from 'phosphor-react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from '../../actions/users';
import { types } from '../../types/types';
import {
  swalConnectionMetamask,
  swalWaitingTxn,
  swalError
} from '../../utils/swalFires';
import { Loading } from '../shared/Loading';
import Swal from 'sweetalert2';

export const HomeAdmin = ({ contract, account }) => {
  const dispatch = useDispatch();
  const { users, status } = useSelector(state => state.users);
  const columns = ['Address', 'Role', 'Approve to sell'];

  useEffect(() => {
    if (contract !== null && account !== '') {
      dispatch(getUsers(contract, account));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApprove = (e, accountSeller) => {
    e.preventDefault();

    swalConnectionMetamask();

    let response = contract.methods
      .approveSeller(accountSeller)
      .send({ from: account });

    response.on('error', function () {
      swalError('You must accept the transaction on metamask to continue');
    });
    response.on('transactionHash', function () {
      swalWaitingTxn();
    });

    response.then(res => {
      if (res.status === true && res.events.UserSellerApproved) {
        Swal.fire({
          icon: 'success',
          title: 'Seller approved successfully'
        }).then(() => dispatch(getUsers(contract, account)));
      }
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
                        default:
                          return '';
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
