import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import MetamaskConnectButton from '../components/MetamaskConnectButton';
import NotesMarketContract from '../contracts/NotesMarketContract.json';
import getWeb3 from '../getWeb3';
import { useDispatch, useSelector } from 'react-redux';
import { types } from '../types/types';
import { useHistory } from 'react-router';
import { contractInstance, accountsWeb3 } from '../lazycorner';

export const LoginScreen = ({ contract, account }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  //const { activate, active, account, deactivate } = useWeb3React();
  //const { account, contract, balance } = state;
  //console.log(state);
  // const [contract, setContract] = useState(null);
  // const [account, setAccount] = useState(null);
  // const [balance, setBalance] = useState(null);

  // useEffect(() => {
  //   const init = async () => {
  //     const instance = await contractInstance;
  //     const accounts = await accountsWeb3;

  //     console.log('instance');
  //     console.log(instance);
  //     setContract(instance);
  //     console.log('account');
  //     console.log(accounts[0]);
  //     setAccount(accounts[0]);

  //     // const manager = await lottery.methods.manager().call();
  //     // const players = await lottery.methods.getPlayers().call();
  //     // const balance = await web3.eth.getBalance(lottery.options.address);

  //     // setManager(manager);
  //     // setPlayers(players);
  //     // setContractBalance(balance);
  //   };
  //   init();
  // }, []);

  // const [state, setState] = useState({
  //   storageValue: 0,
  //   web3: null,
  //   accounts: null,
  //   contract: null
  // });

  useEffect(() => {
    async function init() {
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();

        //setState(value => ({ ...value, web3, accounts, contract: instance }));
      } catch (error) {
        alert(
          'Failed to load web3, accounts, or contract. Check console for details.'
        );
        console.error(error);
      }
    }
    if (account === null) {
      init();
    }
  }, []);

  const addNewUser = async noteOwner => {
    console.log(' ------- ------ -------- ------- ');
    console.log(account);
    let response = contract.methods.addUser(noteOwner).send({ from: account });
    response.then(res => {
      console.log(res);
      // const role = res._isAdmin ? 'admin' : res._isSeller ? 'seller' : 'buyer';
      const role = res.noteOwner ? 'seller' : 'buyer';
      if (res.status == true && res.events.UserCreated) {
        alert('you have been successfully registered');
        localStorage.setItem('isAuthenticated', true);
        dispatch({
          type: types.authLogin,
          payload: {
            account: account,
            //balance: balance,
            isAuthenticated: true,
            role: role
          }
        });
        history.push('/');
      }
    });
    // console.log(response);
    // console.log(state.contract);
    // let usersCount = await state.contract.methods.usersCount().call();
    // console.log(usersCount);
    // if (response.status == true && response.events.UserCreated) {
    //   alert('you have been successfully registered');
    //   localStorage.setItem('isAuthenticated', true);
    //   history.push('/');
    // }
  };

  const getUser = () => {
    let user = contract.methods
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
        localStorage.setItem('isAuthenticated', true);
        dispatch({
          type: types.authLogin,
          payload: {
            account: account,
            //balance: balance,
            role: role
          }
        });

        // if (res._authStatus) {
        //   //history.push('/');
        // }
      })
      .catch(err => {
        console.log(err);
        alert('You have no account registered');
      });
  };
  const connectToMetamask = async e => {
    e.preventDefault();
    console.log('---------------------------');
    const web3 = await getWeb3();
    console.log(web3);
    console.log('jolines');
  };

  // const connectToMetamask = () => {
  //   console.log('---------------------------');
  //   try {
  //     const web3 = getWeb3().then(res => {
  //       const accounts = web3.eth.getAccounts();
  //       let balance = null;
  //       web3.eth.getBalance(accounts[0], function (error, wei) {
  //         if (!error) {
  //           balance = web3.utils.fromWei(wei, 'ether');
  //         }
  //       });
  //       //.then((res, wei) => {});

  //       const networkId = web3.eth.net.getId();
  //       const deployedNetwork = NotesMarketContract.networks[networkId];
  //       const instance = new web3.eth.Contract(
  //         NotesMarketContract.abi,
  //         deployedNetwork && deployedNetwork.address
  //       );
  //       instance.options.address = process.env.REACT_APP_CONTRACT_ADDR;

  //       // setState(value => ({
  //       //   ...value,
  //       //   web3,
  //       //   accounts,
  //       //   account: accounts[0],
  //       //   balance,
  //       //   contract: instance
  //       // }));
  //       console.log(instance);
  //       dispatch({
  //         type: types.setContract,
  //         payload: instance
  //       });
  //     });
  //   } catch (error) {
  //     alert(
  //       'Failed to load web3, accounts, or contract. Check console for details.'
  //     );
  //     console.error(error);
  //   }
  // };

  return (
    <div className="login">
      <h2>The lazy corner</h2>
      <p>You must provide a metamask account to enter the market</p>
      <MetamaskConnectButton />
      {/* <button onClick={connectToMetamask}>Connect to metamask</button> */}
      <p>{account}</p>
      {/*<p>{balance}</p> */}
      {account && (
        <>
          <button onClick={getUser}>I already have an account</button>
          <hr />
          <button onClick={() => addNewUser(false)}>Login as Buyer</button>
          <button onClick={() => addNewUser(true)}>Login as Seller</button>
        </>
      )}
    </div>
  );
};
