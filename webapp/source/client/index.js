import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import {Router, Route, browserHistory} from 'react-router';
import applyRouterMiddleware from 'react-router-apply-middleware';
import {syncHistoryWithStore, routerReducer} from 'react-router-redux';
import reducers from 'shared/reducers';
import './style.css';
import App from 'shared/components/app';
import createTestData from 'shared/components/test-data';
import AuthService from '../auth0';
import Login from 'shared/components/login';
import { load, save } from 'redux-localstorage-simple';

// Add the reducer to your store on the `routing` key
const createStoreWithMiddleware
  = applyMiddleware(
  save({ states: ["lights", "books", "session", "things"], namespace : "store_list"})
)(createStore);

const preloadState = Object.assign(
  {},
  window.BOOTSTRAP_CLIENT_STATE,
  load({states: ["lights", "books", "session", "things"], namespace: "store_list"})
);

const store = createStoreWithMiddleware(
  combineReducers({
    ...reducers,
    routing: routerReducer
  }),
  preloadState
    // window.BOOTSTRAP_CLIENT_STATE,
    // load({namespace: "store_list"})
  // hydrating server.
 // window.BOOTSTRAP_CLIENT_STATE
);
const auth = new AuthService('nECE0Vdmupwn3lhf68GeYGJjk9JP50MG', 'workshopiot.eu.auth0.com', store);
//auth.setStore(store);
// validate authentication for private routes
// const requireAuth = (nextState, replace) => {
//   if (!auth.loggedIn()) {
//     replace({pathname: '/login'})
//   }
// };


// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);


// Required for replaying actions from devtools to work
// reduxRouterMiddleware.listenForReplays(store)

ReactDOM.render(
  <Provider store={store}>
    <Router history={ history }>
      <Route path="/" component={ Login } auth={auth}/>
        <Route path="/home" component={ App } auth={auth}/>
        <Route path="/test-data" component={ createTestData(React) }/>
    </Router>
  </Provider>,
  document.getElementById('root')
);
