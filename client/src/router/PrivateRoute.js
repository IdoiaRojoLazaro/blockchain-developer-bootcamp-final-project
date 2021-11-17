import React from 'react';
import PropTypes from 'prop-types';

import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute = ({
  isAuthenticated,
  state,
  component: Component,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      component={props =>
        isAuthenticated ? (
          <Component {...props} state={state} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

PrivateRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  state: PropTypes.object.isRequired,
  component: PropTypes.func.isRequired
};
