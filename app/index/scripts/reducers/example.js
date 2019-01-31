// @flow
import { INCREMENT, DECREMENT } from '../constants';

const initialState = 0;

export default function example(state = initialState, action) {
  switch (action.type) {
    case INCREMENT:
      return state + 1;
    case DECREMENT:
      return state - 1;
    default:
      return state;
  }
}
