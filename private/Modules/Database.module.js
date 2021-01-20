const
  mongoose = require('mongoose'),
  config = require('dotenv').config().parsed;

const
  CONSTANTS = require('../Common/Constants'),
  HELPERS =  require('../Common/Helpers'),
  AbstractModule = require('./Abstract.module');

const
  getUserModel = require('../Models/User.model'),
  getPlateModel = require('../Models/Plate.model'),
  getCharityModel = require('../Models/Charity.model'),
  getHashtagModel = require('../Models/Hashtag.model'),
  getFeedbackModel = require('../Models/Feedback.model');

const
  {APP_ADMIN_EMAIL, APP_ADMIN_PASSWORD, APP_TEST_USER, APP_TEST_PASSWORD} = config,
  {DB_MODELS, PROFILE, MODULES, PROVIDERS, SPECIAL_KEYS} = CONSTANTS,
  {PIPE, AS_FUNCTION} = HELPERS;

const
  {DB_HOST, DB_PORT, DB_NAME} = config;

const
  refreshAdminUser = (UserModel) => PIPE(
    () => UserModel.findOne({[PROFILE.EMAIL]: APP_ADMIN_EMAIL}),
    adminUser => !adminUser && PIPE(
      () => global[MODULES.AUTH].getHashedPassword(APP_ADMIN_PASSWORD),
      hashedPassword => new UserModel({
        [PROFILE.EMAIL]: APP_ADMIN_EMAIL,
        [PROVIDERS.LOCAL]: {
          [PROFILE.NAME]: PROFILE.ADMIN,
          [PROFILE.FIRST_NAME]: PROFILE.ADMIN,
          [PROFILE.LAST_NAME]: PROFILE.ADMIN,
          [PROFILE.HASHED_PASSWORD]: hashedPassword
        },
        [SPECIAL_KEYS.IS_ADMIN]: true
      }).save()
    )
  ),
  refreshTestUser = (UserModel) => PIPE(
    () => UserModel.findOne({[PROFILE.EMAIL]: APP_TEST_USER}),
    adminUser => !adminUser && PIPE(
      () => global[MODULES.AUTH].getHashedPassword(APP_TEST_PASSWORD),
      hashedPassword => new UserModel({
        [PROFILE.EMAIL]: APP_TEST_USER,
        [PROVIDERS.LOCAL]: {
          [PROFILE.NAME]: 'TestUser',
          [PROFILE.FIRST_NAME]: 'Test',
          [PROFILE.LAST_NAME]: 'User',
          [PROFILE.HASHED_PASSWORD]: hashedPassword
        }
      }).save()
    )
  );

class DatabaseModule extends AbstractModule {

  Models = {};

  connect = (
    connectionPath = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`,
    connectionSettings = {}
  ) => PIPE(
    () => Object.assign({
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true
    }, connectionSettings),

    settings => mongoose.connect(connectionPath, settings),

    () => [
      getUserModel,
      getPlateModel,
      getCharityModel,
      getHashtagModel,
      getFeedbackModel
    ].forEach(getModel => AS_FUNCTION(getModel, this.Models)),
    
    () => this
  );

  disconnect = () => mongoose.disconnect();

  isConnected = () => mongoose.connection.readyState === 1;

  getModel = (modelName) => this.Models[modelName] || null;

  getCurrentConnection = () => mongoose.connection;
  
  refreshDefaultEntities = () => {
    const
      userModel = this.getModel(DB_MODELS.APP_USER);

    return PIPE(
      () => refreshAdminUser(userModel),
      () => refreshTestUser(userModel)
    );
  };
}

module.exports = DatabaseModule;
