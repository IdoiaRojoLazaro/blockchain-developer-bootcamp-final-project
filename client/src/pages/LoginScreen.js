import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { types } from '../types/types';
import { useHistory } from 'react-router';
import { cropAccountString } from '../utils/generalFunctions';
import { Spinner } from 'phosphor-react';
import { Title } from '../components/shared/Title';

export const LoginScreen = ({ contract, account, balance }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { checking } = useSelector(state => state.auth);

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
            balance: balance,
            isAuthenticated: true,
            role: role,
            uid: 1
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
            balance: balance,
            role: role,
            isAuthenticated: true,
            uid: 1
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
          {account && (
            <>
              <button onClick={getUser}>I have an account</button>
              <p>{'<<'}</p>
              <button onClick={() => addNewUser(false)}>Login as Buyer</button>
              <p>{'<<'}</p>
              <button onClick={() => addNewUser(true)}>Login as Seller</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
