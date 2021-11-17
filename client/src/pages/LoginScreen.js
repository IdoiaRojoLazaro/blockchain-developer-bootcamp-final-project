import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import MetamaskConnectButton from '../components/MetamaskConnectButton';
import NotesMarketContract from '../contracts/NotesMarketContract.json';
import getWeb3 from '../getWeb3';
import { useHistory } from 'react-router';

export const LoginScreen = ({ state }) => {
  const { activate, active, account, deactivate } = useWeb3React();
  const history = useHistory();

  // const [state, setState] = useState({
  //   storageValue: 0,
  //   web3: null,
  //   accounts: null,
  //   contract: null
  // });

  // useEffect(() => {
  //   async function init() {
  //     try {
  //       const web3 = await getWeb3();
  //       const accounts = await web3.eth.getAccounts();

  //       const networkId = await web3.eth.net.getId();
  //       const deployedNetwork = NotesMarketContract.networks[networkId];
  //       const instance = new web3.eth.Contract(
  //         NotesMarketContract.abi,
  //         deployedNetwork && deployedNetwork.address
  //       );
  //       console.log(instance);

  //       // instance.options.address = '0xA65990EC0CA555d2eCDD1d84E9D1397CFA967E60';
  //       //instance.options.address = '0xE353ae33bCB3478213369662ad275D81bdFe178A';
  //       instance.options.address = process.env.REACT_APP_CONTRACT_ADDR;

  //       setState(value => ({ ...value, web3, accounts, contract: instance }));
  //     } catch (error) {
  //       alert(
  //         'Failed to load web3, accounts, or contract. Check console for details.'
  //       );
  //       console.error(error);
  //     }
  //   }
  //   init();
  // }, []);

  useEffect(() => {
    if (state && state.contract) {
      console.log(state.contract.allEvents);
      let user = state.contract.methods
        .getUser()
        .call({ from: state.accounts[0] })
        .then(res => {
          console.log(res);
          if (res._authStatus) {
            history.push('/');
          }
        });
      console.log('user');
      console.log(user);
    }
  }, [state]);

  const addNewUser = async noteOwner => {
    console.log(account);
    console.log(state);
    let response = state.contract.methods
      .addUser(noteOwner)
      .send({ from: account });
    response.then(res => {
      console.log(res);
      if (response.status == true && response.events.UserCreated) {
        alert('you have been successfully registered');
        localStorage.setItem('isAuthenticated', true);
        history.push('/');
      }
    });
    console.log(response);
    console.log(state.contract);
    let usersCount = await state.contract.methods.usersCount().call();
    console.log(usersCount);
    if (response.status == true && response.events.UserCreated) {
      alert('you have been successfully registered');
      localStorage.setItem('isAuthenticated', true);
      history.push('/');
    }
  };

  return (
    <div className="login">
      <h2>The lazy corner</h2>
      <p>You must provide a metamask account to enter the market</p>
      <MetamaskConnectButton />

      {account && (
        <>
          <button onClick={() => addNewUser(false)}>Login as Buyer</button>
          <button onClick={() => addNewUser(true)}>Login as Seller</button>
        </>
      )}
    </div>
  );
};
