import React from 'react';
import PropTypes from 'prop-types';

import { Route } from 'react-router-dom';

export const PublicRoute = ({ state, component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      component={props => <Component {...props} state={state} />}
    />
  );
};

PublicRoute.propTypes = {
  component: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired
};
