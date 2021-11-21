import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';

import { PublicRoute } from './PublicRoute';
import { PrivateRoute } from './PrivateRoute';
import Home from '../pages/Home';
import { UsersScreen } from '../pages/Users';
import { LoginScreen } from '../pages/LoginScreen';
import { NewNoteScreen } from '../pages/Note/NewNoteScreen';
import { Note } from '../pages/Note';

import { Spinner, WarningCircle, ArrowsClockwise } from 'phosphor-react';
import { types } from '../types/types';
import { useHistory } from 'react-router';
import { contractInstance, accountsWeb3 } from '../lazycorner';

export const AppRouter = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshPage = () => window.location.reload();

  const { checking, connection } = useSelector(state => state.auth);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated')
      ? true
      : false;
    setIsAuthenticated(isAuthenticated);
  }, []);

  useEffect(() => {
    const init = async () => {
      const instance = await contractInstance;
      const accounts = await accountsWeb3;

      console.log('instance');
      console.log(instance);
      setContract(instance);
      console.log('account');
      console.log(accounts[0]);
      setAccount(accounts[0]);
      setIsLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (isAuthenticated && contract !== null && account !== null) {
      contract.methods
        .getUser()
        .call({ from: account })
        .then(res => {
          console.log('user');
          console.log(res);
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
              role: role
            }
          });
        });
    }
  }, [isAuthenticated, account]);

  // useEffect(() => {
  //   if (state.web3 !== null && state.accounts !== null && state.contract) {
  //     let user = state.contract.methods
  //       .getUser()
  //       .call({ from: state.accounts[0] })
  //       .then(res => {
  //         console.log(res);
  //         if (res._authStatus) {
  //           //history.push('/');
  //         }
  //       });
  //     console.log('user');
  //     console.log(user);
  //     // dispatch({
  //     //   type: types.authLogin,
  //     //   payload: {
  //     //     account: state.accounts[0]
  //     //   }
  //     // });
  //   }
  // }, [state.storageValue, state.web3, state.accounts]);

  // useEffect(() => {
  //   async function init() {
  //     console.log('---------------------------');
  //     try {
  //       const web3 = await getWeb3();
  //       console.log(web3);
  //       const accounts = await web3.eth.getAccounts();
  //       let balance = null;
  //       web3.eth.getBalance(accounts[0], function (error, wei) {
  //         if (!error) {
  //           balance = web3.utils.fromWei(wei, 'ether');
  //         }
  //       });
  //       //.then((res, wei) => {});

  //       const networkId = await web3.eth.net.getId();
  //       const deployedNetwork = NotesMarketContract.networks[networkId];
  //       const instance = new web3.eth.Contract(
  //         NotesMarketContract.abi,
  //         deployedNetwork && deployedNetwork.address
  //       );
  //       instance.options.address = process.env.REACT_APP_CONTRACT_ADDR;

  //       setState(value => ({
  //         ...value,
  //         web3,
  //         accounts,
  //         account: accounts[0],
  //         balance,
  //         contract: instance
  //       }));
  //     } catch (error) {
  //       alert(
  //         'Failed to load web3, accounts, or contract. Check console for details.'
  //       );
  //       console.error(error);
  //     }
  //   }
  //   debugger;
  //   if (checking) {
  //     init();
  //   }
  // }, []);

  // if (checking) {
  //   return (
  //     <div className="loading">
  //       <Spinner weight="duotone" size={60}>
  //         <animate
  //           attributeName="opacity"
  //           values="0;1;0"
  //           dur="4s"
  //           repeatCount="indefinite"></animate>
  //         <animateTransform
  //           attributeName="transform"
  //           attributeType="XML"
  //           type="rotate"
  //           dur="5s"
  //           from="0 0 0"
  //           to="360 0 0"
  //           repeatCount="indefinite"></animateTransform>
  //       </Spinner>
  //       <h5>Waiting for connection with backend...</h5>
  //     </div>
  //   );
  // }
  if (isLoading) {
    return (
      <div className="loading">
        <WarningCircle size={60} />
        <h5>No connection with metamask...</h5>
        <p>You must have metamask installed to continue ...</p>
        <button className="btn btn-save" onClick={refreshPage}>
          <ArrowsClockwise size={18} color="#fff" />
          Click to reload!
        </button>
      </div>
    );
  } else {
    return (
      <div>
        <Router>
          <div>
            <Switch>
              <PublicRoute
                exact
                path="/login"
                component={LoginScreen}
                isAuthenticated={!!isAuthenticated}
                contract={contract}
                account={account}
              />
              {/* -------- Private routes -------- */}
              <PrivateRoute
                exact
                path="/"
                component={Home}
                isAuthenticated={!!isAuthenticated}
                contract={contract}
                account={account}
              />
              <PrivateRoute
                exact
                path="/users"
                component={UsersScreen}
                isAuthenticated={!!isAuthenticated}
                contract={contract}
                account={account}
              />
              <PrivateRoute
                exact
                path="/note/:id"
                component={Note}
                isAuthenticated={!!isAuthenticated}
                contract={contract}
                account={account}
              />
              {/* <PublicRoute
              exact
              path="/note/:id"
              component={Note}
              state={state}
            />
            <PublicRoute exact path="/note_new" component={NewNoteScreen} /> */}
              <Redirect to={'/'} />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
};
