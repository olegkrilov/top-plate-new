const
  mongoose = require('mongoose');

const
  CONSTANTS = require('../Common/Constants'),
  HELPERS = require('../Common/Helpers'),
  FEEDBACK_SCHEMA = require('../Schemas/Feedback.schema');

const
  {DB_MODELS} = CONSTANTS;

const
  Schema = new mongoose.Schema(FEEDBACK_SCHEMA, {
    collection: DB_MODELS.FEEDBACK,
    timestamps: true
  });

module.exports = (modelsCollection) =>
  modelsCollection[DB_MODELS.FEEDBACK] = new mongoose.model(DB_MODELS.FEEDBACK, Schema);

