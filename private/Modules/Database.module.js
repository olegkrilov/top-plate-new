const
  mongoose = require('mongoose'),
  config = require('dotenv').config().parsed;

const
  AbstractModule = require('./Abstract.module');

const
  getUserModel = require('../Models/User.model'),
  getPlateModel = require('../Models/Plate.model'),
  getCharityModel = require('../Models/Charity.model'),
  getHashtagModel = require('../Models/Hashtag.model'),
  getFeedbackModel = require('../Models/Feedback.model');

const
  {PIPE, AS_FUNCTION} = require('../Common/Helpers');

const
  {DB_HOST, DB_PORT, DB_NAME} = config;

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

}

module.exports = DatabaseModule;
