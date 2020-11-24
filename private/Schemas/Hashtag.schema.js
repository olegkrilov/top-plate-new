const
  {COMMON, SPECIAL_KEYS} = require('../Common/Constants');

module.exports = {
  [COMMON.LABEL]: {
    type: String,
    required: true,
    unique: true
  },
  [COMMON.STATUS]: {
    type: Boolean,
    default: false
  },
  [SPECIAL_KEYS.USED_IN]: {
    type: [String],
    default: []
  }
}
