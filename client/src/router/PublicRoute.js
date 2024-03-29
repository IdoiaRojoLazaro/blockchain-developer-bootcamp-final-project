import React from 'react';
import PropTypes from 'prop-types';

import { Route, Redirect } from 'react-router-dom';

export const PublicRoute = ({
  isAuthenticated,
  contract,
  component: Component,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      component={(props) =>
        isAuthenticated ? (
          <Redirect to="/" />
        ) : (
          <Component {...props} contract={contract} />
        )
      }
    />
  );
};

PublicRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired
};
