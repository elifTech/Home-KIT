import db from 'db';
import awsCli from 'aws-cli-js';
import Aws from 'aws';
import config from '../../../config';

const get = (req, res) => {
  db.getCreds({user: req.query.user})
    .then(result => {
      if (result) {
        return res.send({
          success: true,
          exists: true
        })
      }
      return res.send({
        success: true,
        exists: false
      })
    })
    .catch(error => {
      res.send({
        success: false,
        error: error.message
      })
    })
};

const post = (req, res) => {
  const bucketName = config.get('aws:s3template') + Date.now();
  Aws.initUser(req.body.accessKey, req.body.secretKey, bucketName)
    .then(result => {
      console.log('initUser', result);
      const roleArn = result[1];
      return db.addCreds({user: req.body.user, accessKey: req.body.accessKey, secretKey: req.body.secretKey, roleArn: roleArn})
    })
    .then(result => {
        return db.bucketName(req.body.user, bucketName);
    })
    .then(result => {
        return res.send({
          success: true,
          bucketName: bucketName
        });
    })
    .catch(error => {
      console.log('Error', error);
      res.send({
        success: false,
        error: error.message
      })
    })
};

const things = (req, res) => {
  db.getCreds({user: req.query.user})
    .then(result => {
      console.log(result);
      if (result) {
        const options = new awsCli.Options(result.accessKey, result.secretKey);
        const aws = new awsCli.Aws(options);
        return aws.command('iot list-things');
      }
      throw new Error('Forbidden');
    })
    .then(result => {
      if (result) {
        return res.send({
          success: true,
          things: result.object.things
        })
      }
      throw new Error('No things');
    })
    .catch(error => {
      res.send({
        success: false,
        error: error.message
      })
    })
} ;

//noinspection JSDuplicatedDeclaration
export default {
  get: get,
  post: post,
  things, things
}
