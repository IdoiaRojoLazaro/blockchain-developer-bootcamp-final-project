import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { types } from '../types/types';
import { cropAccountString } from '../utils/generalFunctions';
import { Title } from '../components/shared/Title';
import { LogoBig } from '../components/shared/LogoBig';
import { Spinner } from 'phosphor-react';
import { Loading } from '../components/shared/Loading';
import {
  swalConnectionMetamask,
  swalWaitingTxn,
  swalSuccess,
  swalError
} from '../utils/swalFires';

export const LoginScreen = ({ contract, account, balance }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { checking } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(false);

  const addNewUser = async isSeller => {
    setLoading(true);
    let response = contract.methods.addUser(isSeller).send({ from: account });
    swalConnectionMetamask();
    response.on('error', function (error) {
      swalError('You must accept the transaction on metamask to continue');
    });
    response.on('transactionHash', function (hash) {
      swalWaitingTxn();
    });
    response.then(res => {
      if (res.status === true && res.events.UserCreated) {
        swalSuccess('You have been successfully registered');

        localStorage.setItem('isAuthenticated', true);
        dispatch({
          type: types.authLogin,
          payload: {
            account: account,
            balance: balance,
            isAuthenticated: true,
            role: isSeller ? 'seller' : 'buyer',
            uid: 1
          }
        });
        history.push('/');
      }
    });
  };

  const getUser = () => {
    contract.methods
      .getUser()
      .call({ from: account })
      .then(res => {
        const role = res._isAdmin
          ? 'admin'
          : res._isSeller
          ? 'seller'
          : 'buyer';
        localStorage.setItem('isAuthenticated', true);
        dispatch({
          type: types.authLogin,
          payload: {
            account: account,
            balance: balance,
            role: role,
            isAuthenticated: true,
            uid: 1
          }
        });
      })
      .catch(() => {
        swalError('You have no account registered');
      });
  };

  return (
    <div className="login">
      <div className="home__navbar">
        <div></div>
        {account ? (
          <button className="btn btn-account">
            {cropAccountString(account)}
          </button>
        ) : (
          <button className="btn">Connect</button>
        )}
      </div>
      <div>
        <LogoBig />
        <Title />
        <p>
          You must provide a <b>metamask</b> account to enter the market
        </p>
        {checking && (
          <div className="loading">
            <Spinner weight="duotone" size={60}>
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur="4s"
                repeatCount="indefinite"></animate>
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                dur="5s"
                from="0 0 0"
                to="360 0 0"
                repeatCount="indefinite"></animateTransform>
            </Spinner>
            <h5>Waiting for connection with metamask...</h5>
          </div>
        )}
        <div className="login-actions flex">
          {loading ? (
            <Loading />
          ) : (
            <>
              {account && (
                <>
                  <button onClick={getUser}>I have an account</button>
                  <p>{'<<'}</p>
                  <button onClick={() => addNewUser(false)}>
                    Sign up as Buyer
                  </button>
                  <p>{'<<'}</p>
                  <button onClick={() => addNewUser(true)}>
                    Sign up as Seller
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
