const
  path = require('path'),
  cors = require('cors'),
  express = require('express'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  expressSession = require('express-session'),
  mongoStoreConstructor = require('connect-mongo'),
  config = require('dotenv').config().parsed;

const
  CONSTANTS = require('./private/Common/Constants'),
  HELPERS = require('./private/Common/Helpers');

const
  DatabaseModule = require('./private/Modules/Database.module'),
  AuthModule = require('./private/Modules/Auth.module'),
  StorageModule = require('./private/Modules/Storage.module');

const
  InitAuthRoutes = require('./private/Routes/Auth.routes'),
  InitProfileRoutes = require('./private/Routes/Profile.routes'),
  InitContentRoutes = require('./private/Routes/Content.routes'),
  InitFeedbackRoutes = require('./private/Routes/Feedback.routes'),
  InitDevRoutes = require('./private/Routes/Dev.routes');

const
  {PORT, NODE_ENV, SESSION_KEY, SESSION_SECRET} = config,
  {APP, DB, SERVER, AUTH, SMTP, STORAGE} = CONSTANTS.MODULES,
  {PIPE} = HELPERS;

const
  STATIC_SOURCE = path.join(__dirname, '/build');

(async function TOP_PLATE_WEBAPP() {
  global[DB] = await connectToDatabase();
  global[APP] = await createApp();
  global[STORAGE] = await initStorageModule();
  global[AUTH] = await initAuthorizationModule();
  global[SERVER] = await runServer();
  ['SIGINT', 'SIGTERM'].forEach(e => process.on(e, stopApp));
})();

async function connectToDatabase () {
  console.log('Now connecting to the Database...');
  return new DatabaseModule(global[APP]).connect();
}

async function createApp () {
  const
    app = express(),
    MongoStore = mongoStoreConstructor(expressSession);

  console.log('Now configuring app...');

  app.use(cors({
    'allowedHeaders': '*',
    'exposedHeaders': '*',
    'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
  }));

  app.use(bodyParser.json({
    parameterLimit: 500000,
    limit: '50mb',
    extended: true
  }));

  app.use(bodyParser.urlencoded({
    parameterLimit: 1000000,
    limit: '100mb',
    extended: false
  }));

  app.use(cookieParser());

  app.use(expressSession({
    saveUninitialized: true,
    resave: true,
    key: SESSION_KEY,
    secret: SESSION_SECRET,
    store: new MongoStore({mongooseConnection: global[DB].getCurrentConnection()})
  }));

  app.use(express.static(__dirname));
  app.use(express.static(STATIC_SOURCE));

  return app;
}

async function initStorageModule () {
  console.log('Now initializing Storage...');
  return new StorageModule(global[APP]).init();
}

async function initAuthorizationModule () {
  console.log('Now running Authorization Module...');
  return new AuthModule(global[APP]).init();
}

async function runServer () {
  console.log('Now running server...');
  return PIPE(
    () => [
      InitAuthRoutes,
      InitProfileRoutes,
      InitContentRoutes,
      InitFeedbackRoutes,
      InitDevRoutes
    ].forEach(intiRoutes => intiRoutes(global[APP])),
    () => global[DB].refreshDefaultEntities(),
    () => NODE_ENV === 'production' && global[APP].get('**',
      (req, res) => res.sendFile(path.resolve(__dirname, './build/index.html'))
    ),
    () => global[APP].listen(PORT, () => console.log(`Top-Plate-2 te salutant on PORT:${PORT}`))
  );
}

async function stopApp () {
  return PIPE(
    () => global[DB].disconnect(),
    () => global[SERVER].close(),
    () => console.log('Good bye!')
  )
}

