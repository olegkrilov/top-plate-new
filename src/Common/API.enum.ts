export enum API_PROPS {
  STATUS = 'status',
  STATUS_TEXT = 'statusText',
  RESPONSE = 'response',
  WITH_CREDENTIALS = 'withCredentials'
}

export enum AUTHORIZATION_API {
  LOGIN_LOCAL = 'login_local',
  CREATE_LOCAL_USER = 'create_local_user',
  TEST_AUTH = 'test_auth',
  LOGOUT = 'logout'
}

export enum PROFILE_API {
  GET_PROFILE = 'get_profile',
  UPDATE_PROFILE = 'update_profile',
  UPDATE_SUBSCRIPTIONS = 'update_subscriptions',
  UPDATE_PASSWORD = 'update_password'
}

export enum CONTENT_API {
  ADD_PLATE = 'add_plate',
  GET_PLATES = 'get_plates',
  GET_PLATE = 'get_plate',
  LIKE_PLATE = 'like_plate',
  DISLIKE_PLATE = 'dislike_plate',
  GET_LIKED_PlATES = 'get_liked_plates',
  GET_OWN_PLATES = 'get_own_plates'
}

export enum FEEDBACK_API {
  ADD_COMMENT = 'add_comment',
  ADD_REPORT = 'add_report',
  GET_COMMENTS = 'get_comments'
}

export enum DEV_API {
  CREATE_RANDOM_PLATES = 'create_random_plates'
}
