import { createStore } from 'redux';
import { appReducer } from './reducers';

export default function makeStore() {
  return createStore(appReducer);
};
