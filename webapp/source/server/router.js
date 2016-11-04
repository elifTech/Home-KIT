import express from 'express';
import lightRoute from './routes/lights';

const router = express.Router();

router.use((req, res, next) => {
  console.log('router!!!');
  next();
});

router.post('/light', lightRoute);

export default router;
