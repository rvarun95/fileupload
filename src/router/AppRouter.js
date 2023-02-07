import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import App from '../components/App';

import FilesList from '../components/FilesList';
import Login from '../components/Login';
import Register from '../components/Register';

const AppRouter = () => (
  <BrowserRouter>
    <div className="container">
      <div className="main-content">
        <Switch>
          <Route component={Login} path="/" exact={true} />
          <Route component={App} path="/home" />
          <Route component={App} path="/home/:id" />
          <Route component={Login} path="/login" />
          <Route component={Register} path="/register" />
          <Route component={FilesList} path="/list" />
        </Switch>
      </div>
    </div>
  </BrowserRouter>
);

export default AppRouter;