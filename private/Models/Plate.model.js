const
  mongoose = require('mongoose');

const
  CONSTANTS = require('../Common/Constants'),
  HELPERS = require('../Common/Helpers'),
  PLATE_SCHEMA = require('../Schemas/Plate.schema');

const
  {DB_MODELS, COMMON, PLATE, FILE_PROPS, RESTAURANT, SPECIAL_KEYS} = CONSTANTS,
  {PIPE, DIG_OUT, DIG_IN, ADD_UNIQUE, REMOVE_UNIQUE} = HELPERS;

const
  Schema = new mongoose.Schema(PLATE_SCHEMA, {
    collection: DB_MODELS.PLATE,
    timestamps: true
  });

Schema[COMMON.METHODS].likeIt = function (userID) {
  const
    Plate = this;

  return PIPE(
    () => ADD_UNIQUE(DIG_OUT(Plate, PLATE.LIKES), userID),
    () => Plate.save()
  );
};

Schema[COMMON.METHODS].dislikeIt = function (userID) {
  const
    Plate = this;

  return PIPE(
    () => REMOVE_UNIQUE(DIG_OUT(Plate, PLATE.LIKES), userID),
    () => Plate.save()
  );
};

Schema[COMMON.METHODS].addComment = function (comment) {
  const
    Plate = this;

  return Plate.updateOne({[PLATE.COMMENTS]: Object.assign(
    DIG_OUT(Plate, PLATE.COMMENTS) || {},
    {[DIG_OUT(comment, COMMON.DB_ID)]: DIG_OUT(comment, COMMON.TEXT)}
  )});
};

Schema[COMMON.METHODS].addReport = function (report) {
  const
    Plate = this;

  return Plate.updateOne({[PLATE.REPORTS]: Object.assign(
    DIG_OUT(Plate, PLATE.REPORTS) || {},
    {[DIG_OUT(report, COMMON.DB_ID)]: DIG_OUT(report, COMMON.TEXT)}
  )});
};

Schema[COMMON.METHODS].getNormalized = function (isLiked = false) {
  const
    Plate = this;

  return [
    COMMON.DB_ID,
    COMMON.INDEX,
    PLATE.NAME,
    PLATE.ENV,
    PLATE.WEEK,
    PLATE.RECIPE,
    PLATE.INGREDIENTS,
    PLATE.LIKES,
    PLATE.COMMENTS,
    PLATE.HASHTAGS,
    PLATE.AUTHOR,
    FILE_PROPS.IMAGE,
    FILE_PROPS.VIDEO,
    RESTAURANT.NAME,
    RESTAURANT.GEO,
    RESTAURANT.COUNTRY,
    RESTAURANT.CITY,
    RESTAURANT.ADDRESS,
    SPECIAL_KEYS.IS_READY,
    SPECIAL_KEYS.CAN_LIKE,
    SPECIAL_KEYS.IS_FIXED
  ].reduce((plate, key) => Object.assign(plate, {[key]: DIG_OUT(Plate, key)}), {
    [SPECIAL_KEYS.IS_LIKED]: !!isLiked,
    [PLATE.COMMENTS]: Object.values(DIG_OUT(Plate, PLATE.COMMENTS))
  });
};

module.exports = (modelsCollection) =>
  modelsCollection[DB_MODELS.PLATE] = new mongoose.model(DB_MODELS.PLATE, Schema);
