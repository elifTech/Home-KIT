import axios from 'axios';

export default (name, user, dispatch) => {
  axios.post('/api/thing', {user: user, thingName: name})
    .then(result => {
      if (!result.data.success) {
        throw new Error('unsuccessful');
      }
      dispatch({type: 'CHANGE_THING', name: 'lights', data: {hasThing: true}})
    }).catch(error => {
    console.log(error);
  })
}
