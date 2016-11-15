import path from 'path';
import express from 'express';
import lightRoute from './routes/lights';
import addThing from './routes/thing';
import keys from './routes/keys';
import multer from 'multer';
import fs from 'fs';
import config from 'config';
import validator from 'express-route-validator';
import scheme from './validation';

const url = config.get('db:url');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!req.body.type || !req.body.user) {
      console.log('File validation failed');
      return cb(null, false);
    }
    const dirPath = path.join(config.get('uploads:keys:path'), req.body.user);
    if (!fs.existsSync(dirPath)){
      fs.mkdirSync(dirPath);
    }
    cb(null, dirPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log('Trying to receive file');
    if (path.extname(file.originalname) !== config.get(`${req.body.type}:extension`)) {
      console.log('File validation failed');
      return cb(null, false);
    }
    console.log('File must be saved');
    cb(null, true);
  }
});

const router = express.Router();

router.use(upload.single('file'));

router.use((req, res, next) => {
  next();
});

router.post('/connect-thing', validator.validate(scheme.thing.connect), addThing.connect);

router.post('/light', validator.validate(scheme.lights.post), lightRoute);

router.post('/thing', validator.validate(scheme.thing.post), addThing.post);

router.get('/thing', validator.validate(scheme.thing.get), addThing.get);

router.get('/has-keys', validator.validate(scheme.keys.get), keys.get);

router.post('/keys', keys.post);

router.delete('/keys', validator.validate(scheme.keys.remove), keys.remove);

export default router;
