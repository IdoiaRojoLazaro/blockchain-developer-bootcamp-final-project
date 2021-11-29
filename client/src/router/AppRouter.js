import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';

import web3 from '../web3';
import { contractInstance } from '../lazycorner';

import { PublicRoute } from './PublicRoute';
import { PrivateRoute } from './PrivateRoute';

import { LoginScreen } from '../pages/LoginScreen';
import { HomeScreen } from '../pages/Home/HomeScreen';

import { types } from '../types/types';

import { Title } from '../components/shared/Title';
import { LogoBig } from '../components/shared/LogoBig';
import { Spinner, WarningCircle, ArrowsClockwise } from 'phosphor-react';

export const AppRouter = () => {
  const dispatch = useDispatch();
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');

  const refreshPage = () => {
    localStorage.clear();
    dispatch({
      type: types.authFinishLoading
    });
  };

  const { checking, status, uid } = useSelector(state => state.auth);

  const isAuthenticated = localStorage.getItem('isAuthenticated')
    ? true
    : false;

  useEffect(() => {
    async function connectToWeb3() {
      await web3()
        .then(web3 => {
          web3.eth.getAccounts().then(accounts => {
            setAccount(accounts[0]);
            web3.eth.getBalance(accounts[0]).then(balanceValue => {
              let balanceFormat = balanceValue;
              setBalance(balanceFormat);
              getContract(accounts[0], balanceFormat);
            });
            dispatch({
              type: types.authWeb3Injected
            });
          });
        })
        .catch(e => {
          console.log('No web3 injected');

          dispatch({
            type: types.authNoWeb3Injected
          });
        });
    }
    connectToWeb3();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getContract = async (acc, bal) => {
    const instance = await contractInstance;
    setContract(instance);
    getUser(acc, instance, bal);
  };

  const getUser = async (account, contract, balance) => {
    if (
      isAuthenticated &&
      contract !== null &&
      account !== null &&
      balance !== null
    ) {
      contract.methods
        .getUser()
        .call({ from: account })
        .then(res => {
          const role = res._isAdmin
            ? 'admin'
            : res._isSeller
            ? 'seller'
            : 'buyer';

          dispatch({
            type: types.authLogin,
            payload: {
              account: account,
              balance: balance,
              role: role,
              uid: 1,
              approveToSell: res._isSellerApproved
            }
          });
        })
        .catch(() => {
          localStorage.clear();
          dispatch({
            type: types.authFinishLoading
          });
        });
    }
  };

  if (checking) {
    return (
      <div className="loading">
        <LogoBig />
        <Title />
        <h5>Waiting for connection with metamask...</h5>
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
      </div>
    );
  }

  if (status === types.completed) {
    return (
      <div>
        <Router>
          <div>
            <Switch>
              <PublicRoute
                exact
                path="/login"
                component={LoginScreen}
                isAuthenticated={!!uid}
                contract={contract}
                account={account}
                balance={balance}
              />
              {/* -------- Private routes -------- */}
              <PrivateRoute
                exact
                path="/"
                component={HomeScreen}
                isAuthenticated={!!uid}
                contract={contract}
                account={account}
                balance={balance}
              />
              <Redirect to={'/'} />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }

  if (status === types.loading) {
    return (
      <div className="loading">
        <Title />
        <WarningCircle size={60} />
        <h5>No connection with metamask...</h5>
        <p>You must have metamask installed to continue ...</p>
        <button className="btn btn-save" onClick={refreshPage}>
          <ArrowsClockwise size={18} color="#fff" />
          Click to reload!
        </button>
      </div>
    );
  }
};
