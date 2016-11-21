import axios from 'axios';

export default (dispatch, user) => {
  axios.get('/api/gas',{
    params: {
      user: user
    }
  })
    .then(result => {
      if (result.data.success) {
        return dispatch({ type: 'SET_VALUE', thingType: 'gas', value: result.data.value });
      }
      console.log('Error', result);
    })
}
