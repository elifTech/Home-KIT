import axios from 'axios';
import response from 'shared/aws-things-response';

export default (accessKey, secretKey, user, dispatch) => {
  axios.post('/api/creds', {user: user, accessKey: accessKey, secretKey: secretKey})
    .then(result => {
      if (!result.data.success) {
        throw new Error('unsuccessful');
      }
      dispatch({type: 'UPDATE_CREDS', hasCreds: true, user: user, thingsResponse: response, dispatch: dispatch})
    }).catch(error => {
    console.log(error);
  })
}
