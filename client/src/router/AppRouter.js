import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

import { PublicRoute } from './PublicRoute';
import { PrivateRoute } from './PrivateRoute';
import Home from '../pages/Home';
import { UsersScreen } from '../pages/Users';
import { LoginScreen } from '../pages/LoginScreen';
import { NewNoteScreen } from '../pages/Note/NewNoteScreen';
import { Note } from '../pages/Note';

import getWeb3 from '../getWeb3';
import NotesMarketContract from '../contracts/NotesMarketContract.json';

export const AppRouter = () => {
  const [state, setState] = useState({
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null
  });

  useEffect(() => {
    async function init() {
      console.log('---------------------------');
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = NotesMarketContract.networks[networkId];
        const instance = new web3.eth.Contract(
          NotesMarketContract.abi,
          deployedNetwork && deployedNetwork.address
        );
        console.log(instance);

        // instance.options.address = '0xA65990EC0CA555d2eCDD1d84E9D1397CFA967E60';
        //instance.options.address = '0xE353ae33bCB3478213369662ad275D81bdFe178A';

        instance.options.address = process.env.REACT_APP_CONTRACT_ADDR;
        console.log(process.env.REACT_APP_CONTRACT_ADDR);

        setState(value => ({ ...value, web3, accounts, contract: instance }));
      } catch (error) {
        alert(
          'Failed to load web3, accounts, or contract. Check console for details.'
        );
        console.error(error);
      }
    }
    init();
  }, []);

  return (
    <div>
      <Router>
        <div>
          <Switch>
            <PublicRoute
              exact
              path="/login"
              component={LoginScreen}
              state={state}
            />
            <PrivateRoute
              exact
              path="/"
              component={Home}
              state={state}
              isAuthenticated={true}
            />
            <PrivateRoute
              exact
              path="/users"
              component={UsersScreen}
              state={state}
              isAuthenticated={true}
            />
            <PublicRoute
              exact
              path="/note/:id"
              component={Note}
              state={state}
            />
            <PublicRoute exact path="/note_new" component={NewNoteScreen} />

            {/* <Redirect to={'/'} /> */}
          </Switch>
        </div>
      </Router>
    </div>
  );
};
