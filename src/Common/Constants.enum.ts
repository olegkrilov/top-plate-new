export enum SERVICES {
  SHARED_SERVICE = 'sharedService',
  ROUTING_SERVICE = 'routingService',
  USER_SERVICE = 'userService',
  API_SERVICE = 'apiService'
}

export enum ROUTES {
  DEFAULT = 'default',
  HOME = 'home',
  SIGN_IN = 'sign-in',
  USERS = 'users',
  PLATES = 'plates'
}

export enum ROUTING_PROPS {
  ROUTE = 'route',
  COMPONENT = 'component',
  PATH = 'path',
  TITLE = 'title',
  ACCESS = 'access'
}

export enum ACCESS_LEVELS {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}

export enum PROFILE {
  USER = 'user',
  NAME = 'name',
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
  GENDER = 'gender',
  EMAIL = 'email',
  PASSWORD = 'password',
  OLD_PASSWORD = 'oldPassword',
  CONFIRM_PASSWORD = 'confirmPassword',
  HASHED_PASSWORD = 'hashedPassword',
  LAST_LOGGED = 'lastLogged',
  PROVIDER = 'provider',
  TOKEN = 'token',
  CURRENT_TOKEN = 'currentToken',
  UPLOADED_PLATES = 'uploadedPlates',
  LIKED_PLATES = 'likedPlates',
  CHARITY_VOTES = 'charityVotes',
  WARNINGS = 'warnings',
  CUSTOM_PROFILE = 'customProfile',
  SUBSCRIPTIONS = 'subscriptions',
  REPORTED_PLATES = 'reportedPlates',
  ADMIN = 'admin',
  IMAGE = 'image'
}

export enum ENVIRONMENTS {
  HOMEMADE = 'homemade',
  RESTAURANT = 'restaurant'
}

