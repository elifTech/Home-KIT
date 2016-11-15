import db from 'db';
import awsStore from 'aws/store';
import AWS from 'aws';
import path from 'path';
import config from 'config';
import setTime from '../set-time';

const post = (req, res) => {
  console.log(req.body);
  db.getThing({user: req.body.user, type: req.body.type})
    .then(result => {
      if (result && result.things && result.things[0].type === req.body.type) {
        return db.rename({user: req.body.user, type: req.body.type, name: req.body.thingName})
      }
      return db.addThing({
        user: req.body.user,
        thingName: req.body.thingName,
        type: req.body.type
      })
    })
    .then(result => {
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
  if (awsStore[req.body.user] && awsStore[req.body.user][req.body.type]) {
    console.log('Thing already in store');
    setTime(req.body.user);
      return res.send({
        success: true,
        type: req.body.type,
        status: awsStore[req.body.user][req.body.type].status
      })
  }
  if (!awsStore[req.body.user]) {
    awsStore[req.body.user] = {};
    console.log('User not in store');
    setTime(req.body.user);
  }
  console.log('Connect body', req.body);
  db.getThing({
    user: req.body.user,
    type: req.body.type
  })
    .then(result => {
      console.log('First query result', result);
      const thing = result.things[0];
      if (!thing.certPath || !thing.keyPath) {
        throw new Error('Forbidden');
      }
      awsStore[req.body.user][req.body.type] = new AWS(req.body.thingName, path.join(config.get('uploads:keys:path'), thing.keyPath), path.join(config.get('uploads:keys:path'), thing.certPath));

      res.send({
        success: true,
        thingName: req.body.type,
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
