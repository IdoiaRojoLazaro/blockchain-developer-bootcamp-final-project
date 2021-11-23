import React from 'react';
import PropTypes from 'prop-types';

import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute = ({
  isAuthenticated,
  contract,
  account,
  balance,
  component: Component,
  ...rest
}) => {
  const isAuthenticated2 = localStorage.getItem('isAuthenticated');
  console.log('--- isAuthenticated ---');
  console.log(isAuthenticated);
  console.log(isAuthenticated2);
  return (
    <Route
      {...rest}
      component={props =>
        isAuthenticated ? (
          <Component
            {...props}
            contract={contract}
            account={account}
            balance={balance}
          />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

PrivateRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  contract: PropTypes.object.isRequired,
  account: PropTypes.string.isRequired,
  component: PropTypes.func.isRequired
};
