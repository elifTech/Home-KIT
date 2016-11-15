import changeLight from '../../../aws';
import store from 'aws/store';
import setTime from '../set-time';

export default (req, res) => {
  console.log('store', store);
  if (!store[req.body.user] || !store[req.body.user][req.body.thingName]) {
    return res.send({
      success: false,
      error: 'Not connected thing'
    });
  }
  let payload = req.body.lights;
  payload[req.body.color] = !payload[req.body.color];
  console.log(store);
  store[req.body.user][req.body.thingName].changeState(payload);
  setTime(req.body.user);
  //changeLight(payload);
  res.send({
    success: true,
    status: store[req.body.user][req.body.thingName].status
  })
}
