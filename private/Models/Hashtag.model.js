const
  mongoose = require('mongoose');

const
  CONSTANTS = require('../Common/Constants'),
  HELPERS = require('../Common/Helpers'),
  HASHTAG_SCHEMA = require('../Schemas/Hashtag.schema');

const
  {DB_MODELS, COMMON, SPECIAL_KEYS} = CONSTANTS,
  {ADD_UNIQUE, DIG_OUT, PIPE} = HELPERS;

const
  Schema = new mongoose.Schema(HASHTAG_SCHEMA, {
    collection: DB_MODELS.HASHTAG,
    timestamps: true
  });

Schema[COMMON.METHODS].associateWithPlate = function (plateID) {
  const
    hashtag = this;

  return PIPE(
    () => ADD_UNIQUE(hashtag[SPECIAL_KEYS.USED_IN], plateID),
    () => hashtag.save()
  );
};

module.exports = (modelsCollection) =>
  modelsCollection[DB_MODELS.HASHTAG] = new mongoose.model(DB_MODELS.HASHTAG, Schema);
