const
  {PROVIDERS, PROFILE, SUBSCRIPTIONS, SPECIAL_KEYS, FEEDBACK_TYPES} = require('../Common/Constants');

module.exports = {
  [PROFILE.EMAIL]: {
    type: String,
    unique: true,
    required: true
  },
  [PROFILE.CUSTOM_PROFILE]: {
    image: String,
    name: String,
    lastName: String,
    firstName: String,
    gender: String,
  },
  [PROVIDERS.LOCAL]: {
    image: String,
    name: String,
    lastName: String,
    firstName: String,
    gender: String,
    hashedPassword: String
  },
  [PROVIDERS.GOOGLE]: {
    id: String,
    image: String,
    name: String
  },
  [PROVIDERS.FACEBOOK]: {
    id: String,
    image: String,
    name: String
  },
  [PROVIDERS.APPLE]: {
    id: String,
    image: String,
    name: String
  },
  [PROFILE.LAST_LOGGED]: {
    type: Object,
    [PROFILE.PROVIDER]: String,
    [PROFILE.TOKEN]: String
  },
  [PROFILE.CURRENT_TOKEN]: String,
  [PROFILE.UPLOADED_PLATES]: [String],
  [PROFILE.LIKED_PLATES]: [String],
  [PROFILE.CHARITY_VOTES]: {
    type: Object,
    default: {}
  },
  [PROFILE.WARNINGS]: [String],
  [PROFILE.SUBSCRIPTIONS]: {
    type: Object,
    default: {
      [SUBSCRIPTIONS.ON_COMMENT]: Boolean,
      [SUBSCRIPTIONS.ON_RATE_CHANGE]: Boolean,
      [SUBSCRIPTIONS.ON_WARNING]: Boolean
    }
  },
  [PROFILE.REPORTED_PLATES]: {
    type: Object,
    default: {}
  },
  [SPECIAL_KEYS.IS_ROBOT]: {
    type: Boolean,
    default: false
  },
  [SPECIAL_KEYS.IS_ADMIN]: {
    type: Boolean,
    default: false
  },
  [SPECIAL_KEYS.IS_SUSPENDED]: {
    type: Boolean,
    default: false
  }
}
