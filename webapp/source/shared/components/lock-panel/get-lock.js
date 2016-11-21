import axios from 'axios';

export default (dispatch, user) => {
  axios.get('/api/lock',{
    params: {
      user: user
    }
  })
    .then(result => {
      if (result.data.success) {
        return dispatch({ type: 'SET_VALUE', thingType: 'lock', value: result.data.value });
      }
      console.log('Error', result);
    })
}
