require('babel-polyfill');

const fs = require('fs');
const express = require('express');
const logger = require('./logger');
const Knex = require('knex');
const { Model } = require('objection');
const _ = require('lodash');
const translateClient = require('@google-cloud/translate')({key: process.env.GOOGLE_TRANSLATE_KEY});

//const morgan = require('morgan');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');

const auth = require('./auth');
const socketSetup = require('./socket');
const User = require('./models/user');
const Convo = require('./models/convo');
const GroupConvo = require('./models/group-convo');

const app = express();

Model.knex(Knex(require('./knexfile')));

app.set('trust proxy', true);
app.set('view engine', 'ejs');
app.set('views', 'server/views');

function wwwRedirect(req, res, next) {
  if (req.headers.host.slice(0, 4) === 'www.') {
    var newHost = req.headers.host.slice(4);
    return res.redirect(301, req.protocol + '://' + newHost + req.originalUrl);
  }
  next();
}

app.use(wwwRedirect);
//app.use(morgan('combined'));
app.use(favicon('server/public/favicon.ico'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(compression());
app.use(express.static('server/public'));
app.use('/session', require('./routes/session'));
app.use('/users', require('./routes/users'));
app.use('/messages', require('./routes/messages'));
app.use('/convos', require('./routes/convos'));
app.use('/charges', auth.middleware, require('./routes/charges'));

let googleLangs = null;

translateClient.getLanguages((err, languageCodes) => {
  googleLangs = _.map(languageCodes, 'code');
  // => ['af', 'ar', 'be', 'bg', 'ca', 'cs', ...]
});

app.get('/*', async (req, res) => {
  let user = auth.verify(req.cookies.auth);
  let privateConvos = [];
  let groupConvos = [];

  if (user && user.id) {
    user = await User
      .query()
      .findById(user.id)
      .eager('[learningLangs, speakingLangs]');

    if (user) {
      privateConvos = await Convo.findAll(user.id);
      groupConvos = await GroupConvo.findByUserId(user.id);
      User.updateLastActive(user.id).then();
    }
  }

  res.render('index', {
    session: {user, convos: {privateConvos, groupConvos}},
    googleLangs,
    prod: process.env.NODE_ENV === 'production'
  });
});

let server;

if (process.env.NODE_ENV === 'production') {
  //// listen https
   server = require('https')
    .createServer({
      key: fs.readFileSync('/etc/letsencrypt/live/matchlang.com/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/matchlang.com/fullchain.pem'),
      ca: fs.readFileSync('/etc/letsencrypt/live/matchlang.com/chain.pem')
    }, app)
    .listen(443, () => console.log('listening at port 443'));

  // redirect to https
  const http = express()
    .get('*',function(req, res){
      res.redirect(`https://${req.hostname}${req.url}`);
    })
    .listen(80);
} else {
  server = require('http')
    .createServer(app)
    .listen(3000, () => console.log('listening at port 3000'));
}

socketSetup(server);

// log uncaught exceptions (includes promises)
process.on('uncaughtException', function(error) {
  logger.debug(error);
});

process.on('unhandledRejection', function(reason, p){
  logger.debug(reason);
});