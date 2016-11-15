import store from 'aws/store';

export default property => {
  if (store.hasOwnProperty(property)) {
    store[property].timestamp = Date.now() / 1000;
  }
}
