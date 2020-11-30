const
  {PROFILE, FILE_PROPS, SUBSCRIPTIONS, PLATE, REQ_PROPS, COMMON} = require('./Constants');

module.exports = {
  CREATE_USER_FORM: [
    PROFILE.EMAIL,
    PROFILE.PASSWORD,
    PROFILE.FIRST_NAME,
    PROFILE.LAST_NAME
  ],
  LOGIN_FORM: [
    PROFILE.EMAIL,
    PROFILE.PASSWORD
  ],
  PROFILE_FORM: [
    PROFILE.NAME,
    PROFILE.FIRST_NAME,
    PROFILE.LAST_NAME,
    PROFILE.GENDER,
    FILE_PROPS.IMAGE
  ],
  SUBSCRIPTIONS_FORM: [
    SUBSCRIPTIONS.ON_WARNING,
    SUBSCRIPTIONS.ON_RATE_CHANGE,
    SUBSCRIPTIONS.ON_COMMENT
  ],
  UPDATE_PASSWORD_FORM: [
    PROFILE.OLD_PASSWORD,
    PROFILE.PASSWORD
  ],
  ADD_PLATE_FORM_FIELDS: [
    PLATE.NAME,
    PLATE.ENV
  ],
  ADD_PLATE_FORM_FILES: [
    [
      FILE_PROPS.IMAGE,
      FILE_PROPS.VIDEO
    ]
  ],
  GET_PLATES_FORM: [
    PLATE.ENV,
    REQ_PROPS.LIMIT,
    REQ_PROPS.CURSOR,
    PLATE.HASHTAGS
  ],
  GET_PLATE_FORM: [
    COMMON.ID,
    REQ_PROPS.LIMIT
  ]
};
