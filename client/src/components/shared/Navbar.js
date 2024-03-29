import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { logout } from '../../actions/auth';

import { cropAccountString } from '../../utils/generalFunctions';
import { LogoSmall } from './LogoSmall';
import Dropdown from 'react-bootstrap/Dropdown';
import { useFormatBalance } from '../../hooks/useFormatBalance';

export const Navbar = () => {
  const dispatch = useDispatch();
  const { account, role, balance } = useSelector(state => state.auth);
  const balanceFormat = useFormatBalance(balance);

  const history = useHistory();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    history.push(`/login`);
  };

  return (
    <div className="home__navbar">
      <h1>
        <LogoSmall /> The lazy corner
      </h1>
      {account && balance && balanceFormat && (
        <Dropdown>
          <Dropdown.Toggle id="dropdown-basic" className="btn btn-account">
            {cropAccountString(account)}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <div className="navbar__user-info">
              <h3>{parseFloat(balanceFormat).toFixed(4)} ETH</h3>
              <p>{role}</p>
            </div>
            <Dropdown.Divider />
            <Dropdown.Item href="" onClick={handleLogout}>
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </div>
  );
};
