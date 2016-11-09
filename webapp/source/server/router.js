import express from 'express';
import lightRoute from './routes/lights';
import addThing from './routes/thing';

const router = express.Router();

router.use((req, res, next) => {
  next();
});

router.post('/light', lightRoute);
router.post('/thing', addThing.post);
router.get('/thing', addThing.get);

export default router;
