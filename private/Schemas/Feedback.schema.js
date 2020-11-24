const
  {COMMON, FEEDBACK} = require('../Common/Constants');

module.exports = {
  [FEEDBACK.TARGET]: {
    type: String,
    required: true
  },
  [FEEDBACK.AUTHOR]: {
    type: String,
    required: true
  },
  [COMMON.TYPE]: {
    type: String,
    required: true
  },
  [COMMON.TEXT]: {
    type: String,
    required: true
  }
};
