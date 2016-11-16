import db from 'db';
import awsCli from 'aws-cli-js';

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
  db.addCreds({user: req.body.user, accessKey: req.body.accessKey, secretKey: req.body.secretKey})
    .then(result => {
        return res.send({
          success: true
        });
    })
    .catch(error => {
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
