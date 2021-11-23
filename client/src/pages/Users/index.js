import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useToasts } from 'react-toast-notifications';

export const UsersScreen = ({ contract, account }) => {
  const history = useHistory();
  const [accountSeller, setAccountSeller] = useState('');
  const { addToast } = useToasts();
  const handleChange = ({ target }) => {
    setAccountSeller(target.value);
  };
  const handleSubmit = e => {
    e.preventDefault();
    let response = contract.methods
      .approveSeller(accountSeller)
      .send({ from: account });
    response.then(txn => {
      console.log('txn seller approved: ', txn);
      if (txn.status && txn.events.UserSellerApproved) {
        addToast('Seller approved successfully', {
          appearance: 'success',
          autoDismiss: true
        });
        setTimeout(() => {
          history.push('/');
        }, 1000);
      }
    });
  };

  return (
    <div>
      <h2>Approve seller</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="account"
          value={accountSeller}
          onChange={handleChange}
        />
        <button type="submit" className="btn">
          Approve seller
        </button>
      </form>
    </div>
  );
};
