import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { logout } from '../../actions/auth';
import { OpenModalAS } from '../../actions/modals';

import { cropAccountString } from '../../utils/generalFunctions';
import { LogoSmall } from './LogoSmall';
import Dropdown from 'react-bootstrap/Dropdown';

export const Navbar = () => {
  const dispatch = useDispatch();
  const { account, role, balance } = useSelector(state => state.auth);
  const history = useHistory();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    history.push(`/login`);
  };

  const handleOpenApproveSellerModal = e => {
    e.preventDefault();
    dispatch(OpenModalAS());
  };

  return (
    <div className="home__navbar">
      <h1>
        <LogoSmall /> The lazy corner
      </h1>
      {account && balance && (
        <Dropdown>
          <Dropdown.Toggle id="dropdown-basic" className="btn btn-account">
            {cropAccountString(account)}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <div className="navbar__user-info">
              <h3>{parseFloat(balance).toFixed(4)} ETH</h3>
              <p>{role}</p>
            </div>
            <Dropdown.Divider />
            {role === 'admin' && (
              <Dropdown.Item href="" onClick={handleOpenApproveSellerModal}>
                Approve user
              </Dropdown.Item>
            )}
            <Dropdown.Item href="" onClick={handleLogout}>
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </div>
  );
};
