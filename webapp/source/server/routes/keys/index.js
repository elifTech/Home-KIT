import db from 'db';
import path from 'path';

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
  if (req.file) {
    console.log('File must be saved');
    const filePath = path.join(req.body.user, req.file.filename);
    db.addKey({
      type: req.body.type,
      user: req.body.user,
      thingName: req.body.thingName,
      filePath: filePath
    })
      .then(result => {
        console.log('result', result);
        if (result) {
          return res.send({
            success: true,
            file: filePath
          })
        }
        throw new Error('Result false');
      })
      .catch(error => {
        return res.send({
          success: false,
          error: error.message
        })
      })
  }
  res.send({
    success: false,
    error: 'File wasn\'t saved'
  })
};

export default {
  get: get,
  post: post
}
