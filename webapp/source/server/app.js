import path from 'path';
import express from 'express';
import noCache from 'connect-cache-control';
import log from 'server/log';
import settings from 'server/settings';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import multipart from 'connect-multiparty';

import api from './router';
import mainRoute from './routes/main';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/home/kevin/dick')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

const upload = multer({storage: storage});

const app = express();



app.use(log.requestLogger());

app.use(bodyParser.json());

app.use(methodOverride());

app.use(upload.single('file'));

//app.use(multipart());



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

export default app;
