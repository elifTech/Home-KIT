import axios from 'axios';

export default (name, type, user, dispatch) => {
  return axios.post('/api/thing', {user: user, thingName: name, type: type})
    .then(result => {
      if (!result.data.success) {
        throw new Error('unsuccessful');
      }
      return dispatch({type: 'CHANGE_THING', thingType: type, name: name, hasThing: true})
    })
}
