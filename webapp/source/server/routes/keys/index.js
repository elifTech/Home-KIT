import db from 'db';

const get = (req, res) => {
  console.log(req.query.user);
  db.getThing({user: req.query.user})
    .then(result => {
      if (result) {
        result.things.map((element, index) => {
          if (element.name == req.query.thingName) {
            if (element.keyPath && element.certPath) {
              return res.send({
                success: true,
                hasKeys: true,
                key: element.keyPath,
                cert: element.certPath
              })
            } else {
              return res.send({
                success: true,
                hasKeys: false,
                key: element.keyPath,
                cert: element.certPath
              })
            }
          }
        });
        throw new Error('Thing not found');
      }
    })
    .catch(error => {
      res.send({
        success: false,
        error: error.message
      })
    })
};

const post = (req, res) => {
  console.log('REQUEST!!!', req);
  console.log(req.file);
  res.send({
    yo: 'man'
  })
};

export default {
  get: get,
  post: post
}
