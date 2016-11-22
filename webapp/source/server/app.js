import path from 'path';
import express from 'express';
import noCache from 'connect-cache-control';
import log from 'server/log';
import settings from 'server/settings';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import multipart from 'connect-multiparty';
import garbageCleaner from './garbage-cleaner';
import Sockets from 'socket.io';
import http from 'http';
import api from './router';
import mainRoute from './routes/main';

const app = express();

const server = new http.Server(app);

const io = new Sockets(server);

garbageCleaner();

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Expose-Headers', 'Content-Length');
  res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
  if (req.method === 'OPTIONS') {
    return res.send(200);
  } else {
    return next();
  }
});

app.use(log.requestLogger());

app.use(bodyParser.json());

app.use(methodOverride());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser({keepExtensions:true,uploadDir:path.join(__dirname)}));

app.get('/log.gif/:message', noCache, log.route());

const buildDir = '/build';

const staticDir = path.join(settings.APP_HOME, buildDir);

app.use('/static', express.static(staticDir));

app.use('/api', api);

app.use('/', mainRoute);

export { app, io };
