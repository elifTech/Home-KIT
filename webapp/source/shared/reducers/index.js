import axios from 'axios';
import store from '../configure-store';

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

const reducers = {
  books,
  title,
  lights
};

export default reducers;
