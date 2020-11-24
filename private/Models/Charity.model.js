const
  mongoose = require('mongoose');

const
  {CHARITY} = require('../Common/Constants').DB_MODELS;

const
  Schema = new mongoose.Schema({
    name: String,
    description: String,
    image: String,
    link: String,
    votes: Object,
    status: {
      type: Boolean,
      default: true
    }
  }, {
    collection: CHARITY,
    timestamps: true
  });

module.exports = (modelsCollection) =>
  modelsCollection[CHARITY] = new mongoose.model(CHARITY, Schema);
