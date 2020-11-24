const
  passport = require('passport'),
  CustomStrategy = require('passport-custom').Strategy,
  bCrypt = require('bcrypt'),
  jwt = require('njwt'),
  config = require('dotenv').config().parsed;

const
  AbstractModule = require('./Abstract.module');

const
  HELPERS = require('../Common/Helpers'),
  CONSTANTS = require('../Common/Constants'),
  EXCEPTIONS = require('../Common/Exceptions');

const
  USER_ACCESS_TOKEN = 'access-token',
  LOCAL_TOKEN_STRATEGY = 'authorize-with-local-token',
  GOOGLE_TOKEN_STRATEGY = 'authorize-with-google-token',
  FB_TOKEN_STRATEGY = 'authorize-with-facebook-token';

const
  {TOKEN_SECRET} = config,
  {DIG_IN, DIG_OUT, PIPE, GET_FROM_FIELDS, GET_FROM_BODY, SEND_ERROR} = HELPERS,
  {DB_MODELS, MODULES, REQ_PROPS, PROFILE, PROVIDERS, COMMON} = CONSTANTS;

class AuthModule extends AbstractModule {

  init = () => {
    const
      {App} = this;

    const
      DatabaseModule = global[MODULES.DB],
      User = DatabaseModule.getModel(DB_MODELS.APP_USER);

    const
      _USER = '_user',
      _TOKEN = '_token';

    passport.use(PROVIDERS.LOCAL, new CustomStrategy( (req,cb) => {
      const
        userData = [PROFILE.EMAIL, PROFILE.PASSWORD].reduce(
            (credentials, key) => Object.assign(
              credentials, {[key]:  DIG_OUT(req, REQ_PROPS.FORM, REQ_PROPS.FIELDS, key)}
            ), {}
          );

      const
        _save = (prop, val) => Object.assign(userData, {[prop]: val}),
        _get = (prop) => DIG_OUT(userData, prop);

      PIPE(
        () => User.findOne({[PROFILE.EMAIL]: userData[PROFILE.EMAIL]}),

        user =>  user ? _save(_USER, user) : EXCEPTIONS.BAD_CREDENTIALS,

        () => this.checkPassword(
          DIG_OUT(userData, PROFILE.PASSWORD),
          DIG_OUT(userData, _USER, PROVIDERS.LOCAL, PROFILE.HASHED_PASSWORD)
        ),

        isValid => isValid ? this.createToken() : EXCEPTIONS.BAD_CREDENTIALS,

        token => token ? _save(_TOKEN, token.compact()) : EXCEPTIONS.SOMETHING_WENT_WRONG,

        () => _get(_USER).login(PROVIDERS.LOCAL, _get(_TOKEN))

      )
        .then(normalizedUser => cb(null, normalizedUser))
        .catch(err => cb(err, null));
    }));

    passport.serializeUser((user, next) => next(null, user));

    passport.deserializeUser((obj, next) => next(null, obj));

    App.use(passport.initialize(undefined));

    App.use(passport.session(undefined));

    return this;
  };

  checkToken = (req, res, next) => {};

  clearSession = (req, res, next) => {
    req.session.destroy();
    req.logout();
    next();
  };

  getHashedPassword = (password, saltLen = 10) => bCrypt.hash(password, saltLen);

  checkPassword = (passwordToCheck, hashedPassword) => bCrypt.compare(passwordToCheck, hashedPassword);

  createToken = (claims = {}) => jwt.create(claims, TOKEN_SECRET);

  authenticate = (strategyName, req, res, next) => passport.authenticate(strategyName, {},
    (err, user) => err ?
      SEND_ERROR(res, EXCEPTIONS.BAD_CREDENTIALS) :
      req.login(user, (err) => err ?
        SEND_ERROR(res, EXCEPTIONS.BAD_CREDENTIALS) :
        next()
      )
  )(req, res, next);

  updateSessionData = (req, userData) => DIG_IN(req, COMMON.SESSION, COMMON.PASSPORT, PROFILE.USER, userData);

}

module.exports = AuthModule;
