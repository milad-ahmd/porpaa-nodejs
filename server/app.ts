require('custom-env').env(true)

import * as bodyParser from 'body-parser';
import * as express from 'express';
const cookieParser = require('cookie-parser')
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import * as path from 'path';
var session = require('express-session')
const fileUpload = require('express-fileupload');
require('dotenv').config()
const expressWinston = require('express-winston');
const winston = require('winston');

import setRoutes from './routes';

const app = express();
app.set('port', (process.env.PORT || 3030));
var cookieSecret = 'secretCookie';

app.use(cookieParser(cookieSecret));

app.use('/', express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'SECRET' })); // session secret
app.use(fileUpload({
    limits: { fileSize: 20 * 1024 * 1024 },
}));

app.use(function (req, res, next) {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,X-Requested-With,content-type,Authorization,*');
    next();
});


//logging system
app.use(expressWinston.logger({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: './logs/server'+((process.env.pm_id) ? process.env.pm_id : '')+'.log' })
  ],
  meta: true, // optional: control whether you want to log the meta data about the request (default to true)
  msg: (req, res) => { return "sess:"+((req.session) ? req.session.id : "logged out") +" > "+req.method+" "+req.url+" - body: "+JSON.stringify(req.body) }, // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  expressFormat: false, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
}));

let mongodbURI;
  mongodbURI = 'mongodb://localhost:27017/porpaa';
  app.use(morgan('dev'));

mongoose.Promise = global.Promise;
const mongodb = mongoose.connect(mongodbURI);

mongodb
  .then((db) => {
    console.log('Connected to MongoDB');
    setRoutes(app);
    app.get('/*', function(req, res) {
      res.sendFile(path.join(__dirname, '../public/index.html'));
    });
      app.listen(app.get('port'), () => {

        console.log('Your Backend listening on port ' + app.get('port'));
      });
  })
  .catch((err) => {
    console.error(err);
});

export { app };
