import React from 'react';
import PropTypes from 'prop-types';

import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const PrivateRoute = ({
  isAuthenticated,
  rolesAllowed,
  component: Component,
  ...rest
}) => {
  const { roles } = useSelector(state => state.auth);
  return (
    <Route
      {...rest}
      component={props =>
        isAuthenticated && rolesAllowed.filter(r => roles.includes(r)) ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

PrivateRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired
};
