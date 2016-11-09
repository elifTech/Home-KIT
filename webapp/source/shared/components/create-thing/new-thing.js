import axios from 'axios';

export default (name, user, dispatch) => {
  axios.post('/api/thing', {user: user, name: name})
    .then(result => {
      if (!result.data.success) {
        throw new Error('unsuccessful');
      }
      dispatch({type: 'HAS_THING', hasThing: true})
    }).catch(error => {
    console.log(error);
  })
}
