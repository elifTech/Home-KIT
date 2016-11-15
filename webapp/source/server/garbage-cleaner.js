import store from 'aws/store';
import config from 'config';

export default () => setInterval(() => {
  for(let item in store) {
    if (store.hasOwnProperty(item) && (Date.now() / 1000) - store[item].timestamp > config.get('garbage:lifecycle')) {
      delete store[item];
    }
  }
}, config.get('garbage:interval'));
