import changeLight from '../../../aws';

export default (req, res) => {
  let payload = req.body.lights;
  payload[req.body.color] = !payload[req.body.color];
  console.log('trigered');
  changeLight(payload);
  res.send({
    success: true
  })
}
