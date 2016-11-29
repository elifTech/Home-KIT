import db from 'db';
import awsStore from 'aws/store';
import AWS from 'aws';
import path from 'path';
import config from 'config';
import setTime from '../set-time';

const post = (req, res) => {
  let userData = {};
  let lambda = '';
  console.log(req.body);
  db.getCreds({user: req.body.user})
    // .then(result => {
      // if (result && result.things && result.things[0].type === req.body.type) {
      //   return db.rename({user: req.body.user, type: req.body.type, name: req.body.thingName})
      // }
    //   return db.getCreds({user: req.body.user});
    // })
    .then(result => {
      console.log('get creds', result);
      if (result) {
        userData = result;
        if (!result.hasOwnProperty('lambdaArn')) {
          return Promise.all([Promise.resolve(result), AWS.createLambda(result.accessKey, result.secretKey, result.roleArn)])
        }
        return Promise.all([Promise.resolve(result)]);
      }
      throw new Error('No get creds result');
    })
    .then(result => {
      if (!result[0].hasOwnProperty('lambdaArn')) {
          lambda = JSON.parse(result[1].raw).FunctionArn;
        return Promise.all([Promise.resolve(result[0]), db.addLambda(result[0].user, JSON.parse(result[1].raw).FunctionArn)]);
      }
      return Promise.all([Promise.resolve(result[0])]);
    })
    .then(result => {
      console.log('Maybe lambda sored', result);
      return AWS.createThing(result[0].accessKey, result[0].secretKey, `${req.body.type}_value`, result[0].lambdaArn || lambda, req.body.user, result[0].bucketName);
    })
    .then(result => {
      console.log('create thing', result[0]);
        return db.addThing({
          user: req.body.user,
          thingName: `${req.body.type}_value`,
          type: req.body.type,
          certPath: path.join(req.body.user, result[1].certName),
          keyPath: path.join(req.body.user, result[1].prvKeyName),
          pubKeyPath: path.join(req.body.user, result[1].pubKeyName)
        })
    })
    .then(result => {
        return AWS.createThing(userData.accessKey, userData.secretKey, `${req.body.type}_report`, userData.lambdaArn || lambda, req.body.user, userData.bucketName);
    })
    .then(result => {
      console.log('Creating report thing', result);
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
      awsStore[req.body.user][req.body.type] = new AWS(
        req.body.thingName,
        path.join(config.get('uploads:keys:path'), thing.keyPath),
        path.join(config.get('uploads:keys:path'), thing.certPath)
      );

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
