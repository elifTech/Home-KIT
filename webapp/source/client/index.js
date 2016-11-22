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
import Edit from 'shared/components/edit';
import Creds from 'shared/components/credentials'
import Lights from 'shared/components/lights-panel';
import Gas from 'shared/components/gas-panel';
import Shine from 'shared/components/shine-panel';
import Lock from 'shared/components/lock-panel';
import io from 'socket.io-client';
import config from '../shared/config';
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
);

const socket = io.connect(`${config.host.protocol}://${config.host.name}:${config.host.port}`);

const auth = new AuthService(config.auth0.id, config.auth0.domain, store, socket);

socket.on('message', message => {
  store.dispatch({ type: 'SET_VALUE', thingType: message.type, value: message.value.value });
});

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);


ReactDOM.render(
  <Provider store={store}>
    <Router history={ history }>
      <Route path="/" component={ Login } auth={auth}/>
        <Route path="/home" component={ App } auth={auth}/>
        <Route path="/lights" component={ Lights } auth={auth}/>
        <Route path="/gas" component={ Gas } auth={auth}/>
        <Route path="/shine" component={ Shine } auth={auth}/>
        <Route path="/lock" component={ Lock } auth={auth}/>
        <Route path="/edit/:name" component={ Edit } auth={auth}/>
        <Route path="/test-data" component={ createTestData(React) }/>
        <Route path="/credentials" component={ Creds } auth={auth}/>
    </Router>
  </Provider>,
  document.getElementById('root')
);
