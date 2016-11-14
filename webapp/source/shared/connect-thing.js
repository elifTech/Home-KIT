import axios from 'axios';

export default (user, thingName, dispatch) => {
  axios.post('/api/connect-thing', {user: user, thingName: thingName})
    .then(result => {
      if (result.data.success) {
        return console.log(result.data);
      }
      throw new Error('Unsuccessful');
    })
    .catch(error => {
      console.log(error);
    })
};
