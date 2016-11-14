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
  hasThing: false
};

const thingsState = {
  lights: {
    hasThing: false,
    hasKeys: false,
    cert: undefined,
    key: undefined
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
    default:
      return state;
  }
};

const things = (state = thingsState, action) => {
  switch (action.type) {
    // case 'HAS_THING' :
    //   let newHasThing = {};
    //   newHasThing[action.thingName] = action.hasThing;
    //   return Object.assign({}, state, newHasThing);
    case 'UPDATE_THINGS':
      console.log(action.data);
      let updatedThing = {};
      updatedThing[action.data.name] = {};
      updatedThing[action.data.name].hasThing = true;
      if (action.data.keyPath && action.data.certPath) {
        updatedThing[action.data.name].hasKeys = true;
        action.connect(action.user, action.data.name, action.dispatch);
      }
      if (action.data.keyPath) {
        let key = action.data.keyPath.split('/');
        updatedThing[action.data.name].key = key[key.length - 1];
      }
      if (action.data.certPath) {
        let cert = action.data.certPath.split('/');
        updatedThing[action.data.name].cert = cert[cert.length - 1];
      }
      return Object.assign({}, state, updatedThing);
    case 'CHECK_THINGS':
      axios.get('/api/thing', {
        params: {
          user: action.token
        }
      })
        .then(action.successResponse);
      return state;
    // case 'CHANGE_HAS_THING':
    //   let newThing = {};
    //   newThing[action.name] = {};
    //   newThing[action.name].hasThing = action.hasThing;
    //   return Object.assign({}, state, newThing);
    // case 'CHANGE_HAS_KEYS':
    //   let newThingKeys = {};
    //   newThingKeys[action.name] = {};
    //   newThingKeys[action.name].hasThing = state[action.name].hasThing;
    //   newThingKeys[action.name].hasKeys = action.data.hasKeys;
    //   newThingKeys[action.name].cert = action.data.cert;
    //   newThingKeys[action.name].key = action.data.key;
    //   return Object.assign({}, state, newThingKeys);
    // case 'HAS_KEYS':
    //   axios.get('api/has-keys', {
    //     params: {
    //       user: action.user,
    //       thingName: action.name
    //     }
    //   })
    //     .then(action.successResponse);
    //   return state;
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
