import axios from 'axios';

export default (dispatch, color) => {
  axios.post('/api/light', { color: color })
    .then((response) => {
      if (!response.data.success) {
        throw new Error('unsuccessful');
      }
      dispatch({ type: 'STATE_CHANGED', color: color })
    })
    .catch((error) => {
      console.log(error);
    });
}
