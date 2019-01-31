// @flow
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { BrowserRouter, Switch, Route, Router } from 'react-router-dom';

import HomePage from './HomePage';

type Props = {
  store: {},
  history: {}
};

export default class Root extends Component<Props> {
  render() {
    const { store, history } = this.props;

    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <>
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route path="/example" component={HomePage} />
              <Route component={HomePage} />
            </Switch>
          </>
        </ConnectedRouter>
      </Provider>
    );
  }
}
