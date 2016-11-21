import axios from 'axios';

export default (dispatch, user) => {
  axios.get('/api/shine',{
    params: {
      user: user
    }
  })
    .then(result => {
      if (result.data.success) {
        return dispatch({ type: 'SET_VALUE', thingType: 'shine', value: result.data.value });
      }
      console.log('Error', result);
    })
}
