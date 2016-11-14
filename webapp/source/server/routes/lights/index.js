import changeLight from '../../../aws';
import store from 'aws/store';

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
  console.log('trigered');
  store[req.body.user][req.body.thingName].changeState(payload);
  //changeLight(payload);
  res.send({
    success: true,
    status: store[req.body.user][req.body.thingName].status
  })
}
