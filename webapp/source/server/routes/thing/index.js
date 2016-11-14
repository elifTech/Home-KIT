import db from 'db';
import awsStore from 'aws/store';
import AWS from 'aws';
import path from 'path';
import config from 'config';

const post = (req, res) => {
  console.log(req.body);
 db.addThing({
   user: req.body.user,
   thingName: req.body.thingName
 }).then(result => {
   res.send({
     success: true
   })
 })
   .catch(error => {
     res.send({
       success: false,
       error: error.message
     })
   })
};

const get = (req, res) => {
  console.log(req.query.user);
  db.getThings(req.query)
    .then(result => {
      if (result) {
        console.log(result);
        return res.send({
          success: true,
          exist: true,
          things: result.things
        })
      }
      res.send({
        success: true,
        exist: false
      })
    })
    .catch(error => {
      res.send({
        success: false,
        error: error.message
      })
    })
};

const connect = (req, res) => {
  if (awsStore[req.body.user] && awsStore[req.body.user][req.body.thingName]) {
      return res.send({
        success: true,
        thingName: req.thingName,
        status: awsStore[req.body.user][req.body.thingName].status
      })
  }
  if (!awsStore[req.body.user]) {
    awsStore[req.body.user] = {};
  }
  console.log('Connect body', req.body);
  db.getThing({
    user: req.body.user,
    thingName: req.body.thingName
  })
    .then(result => {
      const thing = result.things[0];
      if (!thing.certPath || !thing.keyPath) {
        throw new Error('Forbidden');
      }
      awsStore[req.body.user][req.body.thingName] = new AWS(req.body.thingName, path.join(config.get('uploads:keys:path'), thing.keyPath), path.join(config.get('uploads:keys:path'), thing.certPath));
      res.send({
        success: true,
        thingName: req.body.thingName,
        status: awsStore[req.body.user][req.body.thingName].status
      })
    })
    .catch(error => {
      res.send({
        success: false,
        error: error.message
      })
    })
};

export default {
  post: post,
  get: get,
  connect: connect
}
