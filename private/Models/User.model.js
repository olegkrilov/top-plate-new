const
  moment = require('moment'),
  mongoose = require('mongoose');

const
  CONSTANTS =  require('../Common/Constants'),
  USER_SCHEMA = require('../Schemas/User.schema'),
  HELPERS = require('../Common/Helpers'),
  FORM_KEYS = require('../Common/FormKeys');

const
  DEFAULT_NAME = 'Guest',
  DEFAULT_ICON = 'assets/icons/default_user_icon.png';

const
  {DB_MODELS, PROVIDERS, PROFILE, FILE_PROPS, COMMON, MODULES, REQ_PROPS, FEEDBACK, SPECIAL_KEYS} = CONSTANTS,
  {PIPE, AS_ARRAY, DIG_OUT, DIG_IN, IS_NOT_UNDEFINED, AS_BOOLEAN, GET_MONTH_STAMP, ADD_UNIQUE, REMOVE_UNIQUE} = HELPERS;

/** Schema */
const
  Schema = new mongoose.Schema(USER_SCHEMA, {
    collection: DB_MODELS.APP_USER,
    timestamps: true
  });

/** Schema Methods */
Schema[COMMON.METHODS].login = function (provider, token) {
  const
    user = this;

  return PIPE(
    () => DIG_IN(user, PROFILE.LAST_LOGGED, PROFILE.PROVIDER, provider),
    () => DIG_IN(user, PROFILE.LAST_LOGGED, PROFILE.TOKEN, token),
    () => user.save(),
    () => user.getNormalized()
  );
};

Schema[COMMON.METHODS].update = function (form) {
  const
    user = this;

  const
    {fields, files} = form,
    customProfile = DIG_OUT(user, PROFILE.CUSTOM_PROFILE) || {},
    originalProfile = DIG_OUT(user, DIG_OUT(user, PROFILE.LAST_LOGGED, PROFILE.PROVIDER) || PROVIDERS.LOCAL) || {};

  return PIPE(
    () => AS_ARRAY(FORM_KEYS.PROFILE_FORM).forEach(key =>
      DIG_IN(user, PROFILE.CUSTOM_PROFILE, key,
        DIG_OUT(fields, key) ||
        DIG_OUT(customProfile, key)) ||
        DIG_OUT(originalProfile, key)
    ),
    () => DIG_IN(
      user, PROFILE.CUSTOM_PROFILE, PROFILE.NAME,
      [PROFILE.FIRST_NAME, PROFILE.LAST_NAME].map(key => DIG_OUT(user, PROFILE.CUSTOM_PROFILE, key)).join(' ')
    ),
    () => user.save(),
    () => user.getNormalized()
  );
};

Schema[COMMON.METHODS].updateSubscriptions = function (form) {
  const
    user = this;

  return PIPE(
    () => FORM_KEYS.SUBSCRIPTIONS_FORM.reduce((agg, key) => {
      const
        _val = DIG_OUT(form, REQ_PROPS.FIELDS, key);

      agg[key] = AS_BOOLEAN(IS_NOT_UNDEFINED(_val) ? _val : (DIG_OUT(user, PROFILE.SUBSCRIPTIONS, key) || false));
      return agg
    }, {}),
    data => DIG_IN(user, PROFILE.SUBSCRIPTIONS, data),
    () => user.save(),
    () => user.getNormalized()
  );
};

Schema[COMMON.METHODS].updatePassword = function (newPassword) {
  const
    user = this;

  return PIPE(
    () => DIG_IN(user, PROVIDERS.LOCAL, PROFILE.HASHED_PASSWORD, newPassword),
    () => user.save(),
    () => user.getNormalized()
  );
};

Schema[COMMON.METHODS].logout = function () {
  const
    user = this;

  return PIPE(
    () => user.currentToken = null,
    () => user.save()
  );
};

Schema[COMMON.METHODS].getNormalized = function () {
  const
    user = this;

  const
    defaultValues = {
      [PROFILE.NAME]: DEFAULT_NAME,
      [FILE_PROPS.IMAGE]: DEFAULT_ICON
    },
    customProfile = DIG_OUT(user, PROFILE.CUSTOM_PROFILE) || {},
    originalProfile = DIG_OUT(user, DIG_OUT(user, PROFILE.LAST_LOGGED, PROFILE.PROVIDER) || PROVIDERS.LOCAL) || {};

  return [
    COMMON.DB_ID,
    PROFILE.WARNINGS,
    PROFILE.EMAIL,
    SPECIAL_KEYS.IS_ADMIN,
    SPECIAL_KEYS.IS_SUSPENDED
  ].reduce(
    (profile, key) => Object.assign(profile, {[key]: DIG_OUT(user, key)}),
    {
      [PROFILE.USER]: AS_ARRAY(FORM_KEYS.PROFILE_FORM).reduce((_profile, key) =>
          Object.assign(_profile, {[key]:
              DIG_OUT(customProfile, key) ||
              DIG_OUT(originalProfile, key)} ||
            DIG_OUT(defaultValues, key)
          ),
        {[PROFILE.EMAIL]: DIG_OUT(user, PROFILE.EMAIL)}
      ),
      [PROFILE.LIKED_PLATES]: AS_ARRAY(user[PROFILE.LIKED_PLATES]).reduce(
        (_plates, key) => Object.assign(_plates, {[key]: true}), {}
      ),
      [PROFILE.SUBSCRIPTIONS]: DIG_OUT(user, PROFILE.SUBSCRIPTIONS) || {}
    }
  );
};

Schema[COMMON.METHODS].getAsPlateAuthor = function () {
  const
    user = this;

  const
    customProfile = DIG_OUT(user, PROFILE.CUSTOM_PROFILE) || {},
    originalProfile = DIG_OUT(user, DIG_OUT(user, PROFILE.LAST_LOGGED, PROFILE.PROVIDER) || PROVIDERS.LOCAL) || {};

  return {
    id: DIG_OUT(user, COMMON.DB_ID),
    name: DIG_OUT(customProfile, PROFILE.NAME) || DIG_OUT(originalProfile, PROFILE.NAME),
    image: DIG_OUT(customProfile, FILE_PROPS.IMAGE) || DIG_OUT(originalProfile, FILE_PROPS.IMAGE)
  }
};

Schema[COMMON.METHODS].likePlate = function (plateID) {
  const
    User = this;

  return PIPE(
    () => ADD_UNIQUE(DIG_OUT(User, PROFILE.LIKED_PLATES), plateID),
    () => User.save()
  );
};

Schema[COMMON.METHODS].dislikePlate = function (plateID) {
  const
    User = this;

  return PIPE(
    () => REMOVE_UNIQUE(DIG_OUT(User, PROFILE.LIKED_PLATES), plateID),
    () => User.save()
  );
};

Schema[COMMON.METHODS].addReport = function (report) {
  const
    User = this;

  return PIPE(
    () => DIG_IN(User, PROFILE.REPORTED_PLATES, DIG_OUT(report, FEEDBACK.TARGET), DIG_OUT(report, COMMON.DB_ID)),
    () => User.save()
  );
};

module.exports = (modelsCollection) =>
  modelsCollection[DB_MODELS.APP_USER] = new mongoose.model(DB_MODELS.APP_USER, Schema);
