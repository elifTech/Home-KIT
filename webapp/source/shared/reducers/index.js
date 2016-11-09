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
    default : return state;
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
      console.log(newSession.token);
      axios.get('/api/thing', {
        params: {
          user: newSession.token
        }
      })
        .then(action.successResponse);
      return Object.assign({}, state, newSession);
    case 'REMOVE_SESSION' :
      let emptySession = {
        logged: false,
        token: null
      };
      return Object.assign({}, state, emptySession);
    case 'HAS_THING' :
      let newHasThing = {
        hasThing: action.hasThing
      };
      return Object.assign({}, state, newHasThing);
    default:
      return state;
  }
};

const reducers = {
  books,
  title,
  lights,
  session
};

export default reducers;
