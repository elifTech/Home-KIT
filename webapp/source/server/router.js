import express from 'express';
import lightRoute from './routes/lights';
import addThing from './routes/thing';
import keys from './routes/keys';

const router = express.Router();

router.use((req, res, next) => {
  next();
});

router.post('/light', lightRoute);

router.post('/thing', addThing.post);

router.get('/thing', addThing.get);

router.get('/has-keys', keys.get);

router.post('/keys', keys.post);

export default router;
