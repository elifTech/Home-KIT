import changeLight from '../../../aws';

export default (req, res) => {
  console.log('yo');
  console.log(req.body);
  changeLight(req.body.color);
  res.send({
    success: true
  })
}
