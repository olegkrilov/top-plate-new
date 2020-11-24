const
  Formidable = require('formidable');

const
  CONSTANTS = require('./Constants'),
  HELPERS = require('./Helpers'),
  EXCEPTIONS = require('./Exceptions');

const
  {REQ_PROPS, PROVIDERS, MODULES, DB_MODELS, PROFILE, COMMON, REQ_METHODS} = CONSTANTS,
  {PIPE, DIG_IN, SEND_ERROR, AS_ARRAY, DIG_OUT, IS_UNDEFINED, IS_NOT_UNDEFINED, IS_NOT_NULL, IS_MULTIPART_FORM} = HELPERS;

const
  PREPARE_FORM = (
    formProp = REQ_PROPS.FORM,
    restrictFields = null
  ) => (req, res, next) => {
    const
      _onReady = () => {
        if (IS_NOT_NULL(restrictFields) && !DIG_OUT(req, formProp, REQ_PROPS.FIELDS))
          SEND_ERROR(res, EXCEPTIONS.BAD_REQUEST)
        else next();
      }

    if (IS_MULTIPART_FORM(req)) {
      const
        form = new Formidable.IncomingForm({multiples: true});

      form.once('error', () => SEND_ERROR(res, EXCEPTIONS.BAD_REQUEST));

      form.parse(req, (err, fields, files) => {
        if (err) SEND_ERROR(res, EXCEPTIONS.BAD_REQUEST);
        else {
          DIG_IN(req, formProp, REQ_PROPS.FIELDS, IS_NOT_NULL(restrictFields) ?
            AS_ARRAY(restrictFields).reduce(
              (_fields, key) => Object.assign(
                _fields, IS_NOT_UNDEFINED(fields[key]) ? {[key]: fields[key]} : {}
              ), {}
            ) : fields)

          DIG_IN(req, formProp, REQ_PROPS.FILES, files);

          _onReady();
        }
      });
    } else {
      if (restrictFields) DIG_IN(req, formProp, REQ_PROPS.FIELDS, AS_ARRAY(restrictFields).reduce(
        (_fields, key) => {
          const
            _val = DIG_OUT(req, REQ_PROPS.BODY, key);

          return IS_NOT_UNDEFINED(_val) ?
            Object.assign(_fields || {},  {[key]: _val}) : _fields;
        }, null
      ));
      else {
        const
          form = {...DIG_OUT(req, REQ_PROPS.BODY)};

        DIG_IN(req, formProp, REQ_PROPS.FIELDS, !!Object.keys(form).length ? form : null);
      }

      _onReady();
    }
  },

  PREPARE_PARAMS = (paramsList = []) => (req, res, next) => {
    AS_ARRAY(paramsList).forEach(key =>
      IS_UNDEFINED(DIG_OUT(req, REQ_PROPS.PARAMS, key)) &&
      DIG_IN(
        req, REQ_PROPS.PARAMS, key,
        DIG_OUT(req, req.method === REQ_METHODS.GET ? REQ_PROPS.QUERY : REQ_PROPS.BODY, key)
      )
    );
    next();
  },

  CHECK_REQUIRED_FIELDS = (requiredKeys, formProp = REQ_PROPS.FORM) => (req, res, next) => {
    const
      fields = DIG_OUT(req, formProp, REQ_PROPS.FIELDS) || {};

    AS_ARRAY(requiredKeys).every(keys => AS_ARRAY(keys).some(key => fields.hasOwnProperty(key))) ?
      next() : SEND_ERROR(res, EXCEPTIONS.REQUIRED_FIELDS_ARE_MISSING);
  },

  CHECK_REQUIRED_FILES = (requiredFiles, formProp = REQ_PROPS.FORM) => (req, res, next) => {
    const
      files = DIG_OUT(req, formProp, REQ_PROPS.FILES) || {};

    AS_ARRAY(requiredFiles).every(keys => AS_ARRAY(keys).some(key => files.hasOwnProperty(key))) ?
      next() : SEND_ERROR(res, EXCEPTIONS.REQUIRED_FILES_ARE_MISSING);
  },

  AUTHENTICATE = (provider = PROVIDERS.LOCAL) => (req, res, next) =>
    global[MODULES.AUTH].authenticate(provider, req, res, next),

  ENSURE_AUTHENTICATION = (needFullUser = false) => (req, res, next) => req.isAuthenticated() ?
    (needFullUser ?
      PIPE(
        () => global[MODULES.DB].getModel(DB_MODELS.APP_USER),
        User => User.findOne({[COMMON.DB_ID]: DIG_OUT(req, PROFILE.USER, COMMON.DB_ID)}),
        userModel => userModel ? (req[PROFILE.USER] = userModel) : SEND_ERROR(res, EXCEPTIONS.NOT_AUTHORIZED)
      )
        .then(() => next())
        .catch(() => SEND_ERROR(res, EXCEPTIONS.NOT_AUTHORIZED)) : next()
    ) : SEND_ERROR(res, EXCEPTIONS.NOT_AUTHORIZED),

  CLEAR_SESSION = () => (req, res, next) => req.isAuthenticated() ?
    global[MODULES.AUTH].clearSession(req, res, next) : next();

module.exports = {
  PREPARE_FORM,
  PREPARE_PARAMS,
  CHECK_REQUIRED_FIELDS,
  CHECK_REQUIRED_FILES,
  AUTHENTICATE,
  ENSURE_AUTHENTICATION,
  CLEAR_SESSION
};
