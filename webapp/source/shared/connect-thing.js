import axios from 'axios';

export default (user, thingName, type, dispatch) => {
  axios.post('/api/connect-thing', {user: user, thingName: thingName, type: type})
    .then(result => {
      if (result.data.success) {
        console.log(result.data);
        return dispatch({type: 'CONNECTED', thingType: type, connected: true});
      }
      throw new Error('Unsuccessful');
    })
    .catch(error => {
      console.log(error);
    })
};
