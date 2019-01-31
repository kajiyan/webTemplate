import { createStore, applyMiddleware, compose } from 'redux';
import { createBrowserHistory, createHashHistory } from 'history';
import { routerMiddleware, routerActions } from 'connected-react-router';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

import createRootReducer from '../reducers';
import * as exampleActions from '../actions/example';

export const history = createBrowserHistory();
const rootReducer = createRootReducer(history);

export default function configureStore(initialState) {
  // const middleware = [thunkMiddleware];
  const middleware = [];

  if (process.env.NODE_ENV === 'development') {
    const logger = createLogger({
      collapsed: true,
      diff: true,
      level: 'info'
    });

    middleware.push(logger);
  }

  const router = routerMiddleware(history);
  middleware.push(router);

  const enhancers = [applyMiddleware(...middleware)];

  const actionCreators = {
    ...exampleActions,
    ...routerActions
  };

  // Redux DevTools Extension がインストールされていれば使用する
  /* eslint-disable */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ actionCreators })
    : compose;
  /* eslint-enable */

  const enhancer = composeEnhancers(...enhancers);

  const store = createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(routerMiddleware(history)))
  );

  return store;
}
