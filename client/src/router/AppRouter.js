import React from 'react';
import { BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import { PublicRoute } from './PublicRoute';
import Home from '../pages/Home';
import { Note } from '../pages/Note';
import { LoginScreen } from '../pages/LoginScreen';

export const AppRouter = () => {
  return (
    <div>
      <Router>
        <div>
          <Switch>
            <PublicRoute exact path="/login" component={LoginScreen} />
            <PublicRoute exact path="/" component={Home} />
            <PublicRoute exact path="/note/:id" component={Note} />

            {/* <Redirect to={'/'} /> */}
          </Switch>
        </div>
      </Router>
    </div>
  );
};
