const
  CONSTANTS = require('../Common/Constants'),
  HELPERS = require('../Common/Helpers'),
  MIDDLEWARES = require('../Common/Middlewares'),
  EXCEPTIONS = require('../Common/Exceptions'),
  FORM_KEYS = require('../Common/FormKeys');

const
  {COMMON, MODULES, DB_MODELS, REQ_PROPS, PROFILE, PROVIDERS, FILE_PROPS, STORAGE, ROUTES} = CONSTANTS,
  {ALREADY_EXISTS} = EXCEPTIONS,
  {DIG_OUT, DIG_IN, IS_NOT_UNDEFINED, PIPE, SEND_ERROR, GET_FROM_FIELDS, GET_FROM_FILES} = HELPERS;

module.exports = (App) => {

  const
    AuthModule = global[MODULES.AUTH];

  const
    GET_FULL_PROFILE_PIPE = (req) => PIPE(
      () => DIG_OUT(req, PROFILE.USER),
      user => user || EXCEPTIONS.NOT_AUTHORIZED
    );

  /** Handlers */
  const
    GET_PROFILE = (req, res) => res.send(DIG_OUT(req, PROFILE.USER)),

    UPDATE_PROFILE = (req, res) => {
      PIPE(
        () => GET_FULL_PROFILE_PIPE(req),
        user => user.update(DIG_OUT(req, REQ_PROPS.FORM)),
        user => AuthModule.updateSessionData(req, user)
      )
        .then(() => res.send({message: 'User profile updated successfully'}))
        .catch(err => SEND_ERROR(res, err));
    },

    UPDATE_SUBSCRIPTIONS = (req, res) => {
      PIPE(
        () => GET_FULL_PROFILE_PIPE(req),
        user => user.updateSubscriptions(DIG_OUT(req, REQ_PROPS.FORM)),
        user => AuthModule.updateSessionData(req, user)
      )
        .then(() => res.send({message: 'User subscriptions updated successfully'}))
        .catch(err => SEND_ERROR(res, err));
    },

    UPDATE_PASSWORD = (req, res) => {
      const
        profile = DIG_OUT(req, PROFILE.USER);

      PIPE(
        () => DIG_OUT(profile, PROVIDERS.LOCAL, PROFILE.HASHED_PASSWORD),
        oldPassword => oldPassword ? AuthModule.checkPassword(
            DIG_OUT(req, REQ_PROPS.FORM, REQ_PROPS.FIELDS, PROFILE.OLD_PASSWORD),
            oldPassword
          ) : EXCEPTIONS.BAD_CREDENTIALS,
        isValid => isValid ?
          AuthModule.getHashedPassword(
            DIG_OUT(req, REQ_PROPS.FORM, REQ_PROPS.FIELDS, PROFILE.PASSWORD)
          ) : EXCEPTIONS.BAD_CREDENTIALS,
        hashedPassword => profile.updatePassword(hashedPassword)
      )
        .then(() => res.send({message: 'Password was updated successfully'}))
        .catch(err => SEND_ERROR(res, err));
    };

  /** Routes */
  App.get(
    `/${ROUTES.PROFILE.GET_PROFILE}`,
    MIDDLEWARES.ENSURE_AUTHENTICATION(),
    GET_PROFILE
  );

  App.post(
    `/${ROUTES.PROFILE.UPDATE_PROFILE}`,
    MIDDLEWARES.ENSURE_AUTHENTICATION(true),
    MIDDLEWARES.PREPARE_FORM(REQ_PROPS.FORM, FORM_KEYS.PROFILE_FORM),
    UPDATE_PROFILE
  );

  App.post(
    `/${ROUTES.PROFILE.UPDATE_SUBSCRIPTIONS}`,
    MIDDLEWARES.ENSURE_AUTHENTICATION(true),
    MIDDLEWARES.PREPARE_FORM(REQ_PROPS.FORM, FORM_KEYS.SUBSCRIPTIONS_FORM),
    UPDATE_SUBSCRIPTIONS
  );

  App.post(
    `/${ROUTES.PROFILE.UPDATE_PASSWORD}`,
    MIDDLEWARES.ENSURE_AUTHENTICATION(true),
    MIDDLEWARES.PREPARE_FORM(REQ_PROPS.FORM, FORM_KEYS.UPDATE_PASSWORD_FORM),
    MIDDLEWARES.CHECK_REQUIRED_FIELDS(FORM_KEYS.UPDATE_PASSWORD_FORM),
    UPDATE_PASSWORD
  );
};

