import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import example from './example';

export default function createRootReducer(history) {
  return combineReducers({
    example,
    router: connectRouter(history)
  });
}
