import { Flashlight } from 'phosphor-react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from '../../actions/users';
import { types } from '../../types/types';
import { Loading } from '../shared/Loading';

export const HomeAdmin = ({ contract, account }) => {
  const dispatch = useDispatch();
  const { users, status } = useSelector(state => state.users);

  useEffect(() => {
    if (contract !== null && account !== '') {
      dispatch(getUsers(contract, account));
      console.log(users);
    }
  }, []);
  return (
    <div>
      {status === types.loading ? (
        <Loading />
      ) : (
        <>
          {users !== null && users.length > 0 ? (
            users.map((user, i) => (
              <>
                <h2>{user[0]}</h2>
                <p key={i}>{user._isSeller ? 'Seller' : 'nooo'}</p>
              </>
            ))
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
