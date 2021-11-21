import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../actions/auth';

import { MagnifyingGlass, User } from 'phosphor-react';

import Dropdown from 'react-bootstrap/Dropdown';
import { useHistory } from 'react-router';

export const Navbar = ({ searchParam }) => {
  const dispatch = useDispatch();
  const { account, role } = useSelector(state => state.auth);
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
      {/* <div className="home__navbar-search-div">
        <form onSubmit={handleSubmitForm}>
          <MagnifyingGlass size={16} />
          <input
            type="search"
            placeholder="Search..."
            name="search"
            autoComplete="off"
            value={search}
            onChange={handleInputChange}
          />
        </form>
      </div> */}
      {/* <button className="navbar__icon">
                <BellSimple size={16} weight="fill" />
            </button> */}
      <Dropdown>
        <Dropdown.Toggle id="dropdown-basic" className="navbar__icon">
          <User size={18} />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <div className="navbar__user-info">
            <h3>{account}</h3>
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
    </div>
  );
};
