import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { routerReducer } from 'react-router-redux';
import reducers from 'shared/reducers';
import { save } from 'redux-localstorage-simple';

const logger = createLogger();
const rootReducer = combineReducers(Object.assign({}, reducers, {
  routing: routerReducer
}));

const configureStore = (initialState = {}) => {
  return compose(
    applyMiddleware(
  //    save({namespace : "store_list"}),
      thunkMiddleware, logger)
  )(createStore)(rootReducer, initialState);
};

export default configureStore;
