import path from 'path';
import express from 'express';
import lightRoute from './routes/lights';
import addThing from './routes/thing';
import keys from './routes/keys';
import multer from 'multer';
import fs from 'fs';
import config from 'config';

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

router.post('/connect-thing', addThing.connect);

router.post('/light', lightRoute);

router.post('/thing', addThing.post);

router.get('/thing', addThing.get);

router.get('/has-keys', keys.get);

router.post('/keys', keys.post);

router.delete('/keys', keys.remove);

export default router;
