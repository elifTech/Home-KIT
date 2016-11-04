import path from 'path';
import express from 'express';
import noCache from 'connect-cache-control';
import log from 'server/log';
import settings from 'server/settings';
import bodyParser from 'body-parser';

import api from './router';
import mainRoute from './routes/main';

const app = express();


app.use(log.requestLogger());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/log.gif/:message', noCache, log.route());

const buildDir = '/build';
const staticDir = path.join(settings.APP_HOME, buildDir);


app.use('/static', express.static(staticDir));

app.use('/api', api);

app.use('/', mainRoute);

export default app;
