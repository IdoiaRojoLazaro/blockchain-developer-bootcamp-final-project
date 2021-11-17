import React, { useState } from 'react';

export const UsersScreen = ({ state }) => {
  const [accountSeller, setAccountSeller] = useState('');
  const handleChange = ({ target }) => {
    setAccountSeller(target.value);
  };
  const handleSubmit = e => {
    e.preventDefault();
    let response = state.contract.methods
      .approveSeller(accountSeller)
      .send({ from: state.accounts[0] });
    response.then(result => {
      console.log('approved user: ', result);
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
