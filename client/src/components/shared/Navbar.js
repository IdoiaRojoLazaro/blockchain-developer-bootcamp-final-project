import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../actions/auth';
import Dropdown from 'react-bootstrap/Dropdown';
import { useHistory } from 'react-router';
import { cropAccountString } from '../../utils/generalFunctions';

export const Navbar = ({ searchParam }) => {
  const dispatch = useDispatch();
  const { account, role, balance } = useSelector(state => state.auth);
  const [search, setSearch] = useState(searchParam ? searchParam : '');
  const history = useHistory();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    history.push(`/login`);
  };

  const handleInputChange = event => {
    setSearch(event.target.value);
  };

  const handleSubmitForm = e => {
    e.preventDefault();
    if (search.length > 0) {
      history.push(`/search?search=${encodeURIComponent(search)}`);
    }
    // dispatch( searchUsers(search) );
  };

  return (
    <div className="home__navbar">
      <h1>The lazy corner</h1>
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
              <Dropdown.Item href="/users">Approve user</Dropdown.Item>
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
