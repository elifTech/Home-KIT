import axios from 'axios';

const initialState = [
  {id: 1, text: 'Book 1', count: 2},
  {id: 2, text: 'Book 2', count: 3},
  {id: 3, text: 'Book 3', count: 4},
];

const lightsState = {
  yellow: false,
  green: false,
  red: false
};

const sessionState = {
  logged: false,
  token: null,
  hasCreds: false,
  thingsList: []
};

const thingsState = {
  lights: {
    name: '',
    hasThing: false,
    hasKeys: false,
    cert: undefined,
    key: undefined,
    connected: false
  },
  gas: {
    name: '',
    hasThing: false,
    hasKeys: false,
    cert: undefined,
    key: undefined,
    connected: false,
    state: 0
  },
  shine: {
    name: '',
    hasThing: false,
    hasKeys: false,
    cert: undefined,
    key: undefined,
    connected: false,
    state: 0
  },
  lock: {
    name: '',
    hasThing: false,
    hasKeys: false,
    cert: undefined,
    key: undefined,
    connected: false,
    state: false
  }
};

const titleInit = 'Light';

const books = (state = {
  items: initialState,
}, action) => {
  switch (action.type) {
    case 'ADD_COUNT':
      const newItems = state.items.map(item => {
        if (item.id === action.item.id) {
          item.count++;
        }

        return item;
      });

      return Object.assign({}, state.items, {
        items: newItems,
      });
    default:
      return state;
  }
};

const lights = (state = lightsState, action) => {
  switch (action.type) {
    case 'STATE_CHANGED':
      const newLight = {};
      newLight[action.color] = !state[action.color];
      console.log(newLight);
      return Object.assign({}, state, newLight);
    default :
      return state;
  }
};

const title = (state = titleInit, action) => {
  return state;
};

const session = (state = sessionState, action) => {
  switch (action.type) {
    case 'UPDATE_CREDS' :
      if (action.hasCreds) {
        axios.get('/api/aws-things', {
          params: {
            user: action.user
          }
        })
          .then(result => action.thingsResponse(result, action.dispatch));
      }
      return Object.assign({}, state, {hasCreds: action.hasCreds});
    case 'CREATE_SESSION' :
      let newSession = {
        logged: true,
        token: action.token.split('.')[0]
      };
      // console.log('new session');
      // axios.get('/api/thing', {
      //   params: {
      //     user: newSession.token
      //   }
      // })
      //   .then(action.successResponse);
      return Object.assign({}, state, newSession);
    case 'REMOVE_SESSION' :
      let emptySession = {
        logged: false,
        token: null
      };
      return Object.assign({}, state, emptySession);
    case 'THINGS_AVAILABLE' :
      return Object.assign({}, state, {things: action.things});
    default:
      return state;
  }
};

const things = (state = thingsState, action) => {
  switch (action.type) {

    case 'CONNECTED':
      let connectedState = {};
      connectedState[action.thingType] = state[action.thingType];
      connectedState[action.thingType].connected = action.connected;
      return Object.assign({}, state, connectedState);

    case 'UPDATE_THINGS':
      console.log(action.data);
      let updatedThing = {};
      updatedThing[action.data.type] = {};
      updatedThing[action.data.type].name = action.data.name;
      updatedThing[action.data.type].hasThing = true;
      if (action.data.keyPath && action.data.certPath) {
        updatedThing[action.data.type].hasKeys = true;
        action.connect(action.user, action.data.name, action.data.type, action.dispatch);
      }
      if (action.data.keyPath) {
        let key = action.data.keyPath.split('/');
        updatedThing[action.data.type].key = key[key.length - 1];
      }
      if (action.data.certPath) {
        let cert = action.data.certPath.split('/');
        updatedThing[action.data.type].cert = cert[cert.length - 1];
      }
      return Object.assign({}, state, updatedThing);

    case 'CHANGE_THING':
      let newThing = {};
      newThing[action.thingType] = state[action.thingType];
      newThing[action.thingType].hasThing = action.hasThing;
      newThing[action.thingType].name = action.name;
      console.log(newThing);
      return Object.assign({}, state, newThing);

    case 'CHECK_THINGS':
      axios.get('/api/thing', {
        params: {
          user: action.token
        }
      })
        .then(action.successResponse);
      return state;

    case 'CLEAR_THINGS' :
      return Object.assign({}, state, thingsState);

    case 'REMOVE_KEY':
      let thingRemoved = {};
      if (action.keyType === 'certificate') {
        action.keyType = 'cert';
      }
      thingRemoved[action.thingName] = state[action.thingName];
      delete thingRemoved[action.thingName][action.keyType];
      thingRemoved[action.thingName].hasKeys = false;
      console.log(thingRemoved);
      return Object.assign({}, state, thingRemoved);

    case 'SET_VALUE':
      let newGasValue = Object.assign({}, state);
      newGasValue[action.thingType].state = action.value;
      return newGasValue;
    default:
      return state
  }
};

const reducers = {
  books,
  title,
  lights,
  session,
  things
};

export default reducers;
