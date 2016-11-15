import axios from 'axios';

export default (name, type, user, dispatch) => {
  axios.post('/api/thing', {user: user, thingName: name, type: type})
    .then(result => {
      if (!result.data.success) {
        throw new Error('unsuccessful');
      }
      dispatch({type: 'CHANGE_THING', thingType: type, name: name, hasThing: true})
    }).catch(error => {
    console.log(error);
  })
}
