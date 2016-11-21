import awsStore from 'aws/store';
import setTime from '../set-time';

const get = (req, res) => {
  console.log('query', req.query);
  console.log('store', awsStore);
  setTime(req.query.user);
  if (!awsStore[req.query.user] || !awsStore[req.query.user].lock) {
    return res.send({
      success: false,
      error: 'The thing is not connected'
    })
  }
  if (awsStore[req.query.user].lock.status.state) {
    return res.send({
      success: true,
      value: awsStore[req.query.user].lock.status.state.reported.value
    });
  }
  return res.send({
    success: false,
    value: 'No data'
  });
};

export default {
  get: get
}
