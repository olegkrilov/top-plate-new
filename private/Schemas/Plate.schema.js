const
  {PLATE, COMMON, PROFILE, FILE_PROPS, RESTAURANT, SPECIAL_KEYS} = require('../Common/Constants');

module.exports = {
  [PLATE.NAME]: {
    type: String,
    required: true
  },
  [PLATE.ENV]: {
    type: String,
    required: true
  },
  [FILE_PROPS.IMAGE]: {
    type: String
  },
  [FILE_PROPS.VIDEO]: {
    type: String
  },
  [COMMON.INDEX]: {
    type: String,
  },
  [PLATE.WEEK]: String,
  [PLATE.RECIPE]: String,
  [PLATE.INGREDIENTS]: [String],
  [RESTAURANT.NAME]: String,
  [RESTAURANT.GEO]: [Number], /** long lat double */
  [RESTAURANT.COUNTRY]: String,
  [RESTAURANT.CITY]: String,
  [RESTAURANT.ADDRESS]: String,
  [PLATE.LIKES]: [String],
  [PLATE.COMMENTS]: {
    type: Object,
    default: {}
  },
  [PLATE.REPORTS]: {
    type: Object,
    default: {}
  },
  [PLATE.HASHTAGS]: [String],
  [PLATE.AUTHOR]: {
    [COMMON.ID]: String,
    [PROFILE.NAME]: String,
    [FILE_PROPS.IMAGE]: String
  },
  [SPECIAL_KEYS.IS_READY]: {
    type: Boolean,
    default: true
  },
  [SPECIAL_KEYS.CAN_LIKE]: {
    type: Boolean,
    default: true
  },
  [SPECIAL_KEYS.IS_FIXED]: {
    type: Boolean,
    default: false
  },
  [SPECIAL_KEYS.IS_TEST]: {
    type: Boolean,
    default: false
  }
};
