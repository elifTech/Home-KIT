import axios from 'axios';
import store from '../../configure-store';
export default (dispatch, color, lights, user, thingName) => {
  // let payload = Object.assign({}, lights);
  // payload[color] = !lights[color];
  axios.post('/api/light', { lights: lights, color: color, user: user, thingName: thingName })
    .then((response) => {
      console.log(response);
      if (!response.data.success) {
        throw new Error('unsuccessful');
      }
      dispatch({ type: 'STATE_CHANGED', color: color })
    })
    .catch((error) => {
      console.log(error);
    });
}
