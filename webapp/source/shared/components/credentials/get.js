import axios from 'axios';
import response from 'shared/aws-things-response';

export default (user, dispatch) => {
    axios.get('/api/creds', {
      params: {
        user: user
      }
    })
      .then(result => {
        if (result.data.success) {
            return dispatch({type: 'UPDATE_CREDS', hasCreds: result.data.exists, user: user, thingsResponse: response, dispatch: dispatch})
        }
        throw new Error('Unsuccessful');
      })
      .catch(error => {
        console.log(error);
        return dispatch({type: 'UPDATE_CREDS', hasCreds: false})
      })
}
