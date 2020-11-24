const
  CONSTANTS = require('../Common/Constants'),
  HELPERS = require('../Common/Helpers'),
  MIDDLEWARES = require('../Common/Middlewares'),
  EXCEPTIONS = require('../Common/Exceptions'),
  FORM_KEYS = require('../Common/FormKeys');

const
  {MODULES, DB_MODELS, REQ_PROPS, PROFILE, PROVIDERS, FILE_PROPS, STORAGE, ROUTES, COMMON} = CONSTANTS,
  {DIG_OUT, DIG_IN, PIPE, SEND_ERROR, GET_FROM_FIELDS, GET_FROM_FILES} = HELPERS;

module.exports = (App) => {

  const
    DatabaseModule = global[MODULES.DB],
    AuthModule = global[MODULES.AUTH],
    StorageModule = global[MODULES.STORAGE];

  const
    UserModel = DatabaseModule.getModel(DB_MODELS.APP_USER);

  /** Handlers */
  const
    LOGIN_LOCAL = (req, res) => res.send(req[PROFILE.USER]),

    LOGOUT = (req, res) => res.send({message: 'User status: Unauthorized'}),

    CREATE_LOCAL_USER = (req, res) => {
      const
        firstName = GET_FROM_FIELDS(req, PROFILE.FIRST_NAME),
        lastName = GET_FROM_FIELDS(req, PROFILE.LAST_NAME);

      const
        userData = {
          [PROFILE.EMAIL]: GET_FROM_FIELDS(req, PROFILE.EMAIL),
          [PROVIDERS.LOCAL]: {
            [PROFILE.NAME]: `${firstName} ${lastName}`,
            [PROFILE.FIRST_NAME]: firstName,
            [PROFILE.LAST_NAME]: lastName,
            [PROFILE.GENDER]: GET_FROM_FIELDS(req, PROFILE.GENDER)
          }
        };

      const
        _createModel = () => PIPE(
          () => UserModel.findOne({[PROFILE.EMAIL]: userData[PROFILE.EMAIL]}),
          user => user ? EXCEPTIONS.ALREADY_EXISTS : new UserModel(userData)
        ),
        _securePassword = User => PIPE(
          () => AuthModule.getHashedPassword(GET_FROM_FIELDS(req, PROFILE.PASSWORD)),
          hashedPassword => DIG_IN(User, PROVIDERS.LOCAL, PROFILE.HASHED_PASSWORD, hashedPassword)
        ),
        _addAvatar = User => PIPE(
          () => StorageModule.saveFile(
            GET_FROM_FILES(req, FILE_PROPS.IMAGE),
            STORAGE.AVATAR_PREFIX,
            DIG_OUT(User, COMMON.DB_ID)
          ),
          avatarSrc => DIG_IN(
            User,
            PROVIDERS.LOCAL,
            FILE_PROPS.IMAGE,
            avatarSrc || GET_FROM_FIELDS(req, FILE_PROPS.IMAGE_CONTENT_TYPE)
          )
        ),
        _save = User => User.save();

      PIPE(
        _createModel,
        _securePassword,
        _addAvatar,
        _save
      )
        .then(User => res.send(User.getNormalized()))
        .catch(err => SEND_ERROR(res, err));
    };

  /** Routes */
  App.post(
    `/${ROUTES.AUTHORIZATION.LOGIN_LOCAL}`,
    MIDDLEWARES.PREPARE_FORM(REQ_PROPS.FORM),
    MIDDLEWARES.CHECK_REQUIRED_FIELDS(FORM_KEYS.LOGIN_FORM),
    MIDDLEWARES.CLEAR_SESSION(),
    MIDDLEWARES.AUTHENTICATE(PROVIDERS.LOCAL),
    LOGIN_LOCAL
  );

  App.get(
    `/${ROUTES.AUTHORIZATION.LOGOUT}`,
    MIDDLEWARES.CLEAR_SESSION(),
    LOGOUT
  );

  App.post(
    `/${ROUTES.AUTHORIZATION.LOGOUT}`,
    MIDDLEWARES.CLEAR_SESSION(),
    LOGOUT
  );

  App.post(
    `/${ROUTES.AUTHORIZATION.CREATE_LOCAL_USER}`,
    MIDDLEWARES.PREPARE_FORM(REQ_PROPS.FORM),
    MIDDLEWARES.CHECK_REQUIRED_FIELDS(FORM_KEYS.CREATE_USER_FORM),
    CREATE_LOCAL_USER
  );

};


