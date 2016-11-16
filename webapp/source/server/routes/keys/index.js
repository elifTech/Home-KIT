import db from 'db';
import path from 'path';
import fs from 'fs';
import config from 'config';

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
      }
      throw new Error('Thing not found');
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
    console.log(req.body);
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
            type: req.body.type,
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
  } else {
    res.send({
      success: false,
      error: 'File wasn\'t saved'
    })
  }
};

const remove = (req, res) => {
  db.getThing({
    user: req.body.user,
    type: req.body.thingType
  })
    .then(result => {
      console.log(result);
      return Promise.all([
        db.removeKey({
        user: req.body.user,
        type: req.body.type,
        thingName: req.body.thingName
      }),
      Promise.resolve(result.things[0])
      ])
    })
    .then(result => {
      const dbResult = result[0];
      const deleted = result[1];
      if (dbResult) {
        if (req.body.type === 'certificate') {
          fs.unlink(path.join(config.get('uploads:keys:path'), deleted.certPath));
        } else if (req.body.type === 'key') {
          fs.unlink(path.join(config.get('uploads:keys:path'), deleted.keyPath));
        }
        return res.send({
          success: true,
          removed: req.body.type
        })
      }
      throw new Error('Remove unsuccessful');
    })
    .catch(error => {
      res.send({
        success: false,
        error: error.message
      })
    })
};

export default {
  get: get,
  post: post,
  remove: remove
}
