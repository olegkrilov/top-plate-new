const
  CONSTANTS = require('../Common/Constants'),
  HELPERS = require('../Common/Helpers'),
  MIDDLEWARES = require('../Common/Middlewares'),
  EXCEPTIONS = require('../Common/Exceptions'),
  FORM_KEYS = require('../Common/FormKeys');

const
  {
    COMMON, MODULES, DB_MODELS, REQ_PROPS,
    PROFILE, ROUTES, PLATE, FEEDBACK, FEEDBACK_TYPES
  } = CONSTANTS,
  {DIG_OUT, DIG_IN, PIPE, SEND_ERROR} = HELPERS;

module.exports = (App) => {
  const
    DatabaseModule = global[MODULES.DB];

  const
    _CREATE_FEEDBACK = (req, type = FEEDBACK_TYPES.COMMENT) => {
      const
        FeedbackModel = DatabaseModule.getModel(DB_MODELS.FEEDBACK);

      return new FeedbackModel({
        [FEEDBACK.AUTHOR]: DIG_OUT(req, PROFILE.USER, COMMON.DB_ID),
        [FEEDBACK.TARGET]: DIG_OUT(req, REQ_PROPS.FORM, REQ_PROPS.FIELDS, COMMON.ID) || DIG_OUT(req, REQ_PROPS.PARAMS, COMMON.ID),
        [COMMON.TYPE]: type,
        [COMMON.TEXT]: DIG_OUT(req, REQ_PROPS.FORM, REQ_PROPS.FIELDS, COMMON.TEXT)
      });
    }

  const
    ADD_COMMENT = (req, res) => {
      const
        PlateModel = DatabaseModule.getModel(DB_MODELS.PLATE);

      PIPE(
        () => _CREATE_FEEDBACK(req),
        comment => PIPE(
          () => PlateModel.findOne({[COMMON.DB_ID]: DIG_OUT(comment, FEEDBACK.TARGET)}),
          plate => plate ? plate.addComment(comment) : EXCEPTIONS.ITEM_NOT_FOUND,
          () => comment.save()
        )
      )
        .then(() => res.send({message: 'Your comment has been saved successfully. Thanks!'}))
        .catch(err => SEND_ERROR(res, err))
    },

    ADD_REPORT = (req, res) => {
      const
        PlateModel = DatabaseModule.getModel(DB_MODELS.PLATE);

      const
        user = DIG_OUT(req, PROFILE.USER);

      PIPE(
        () => _CREATE_FEEDBACK(req, FEEDBACK_TYPES.REPORT),
        report => PIPE(
          () => PlateModel.findOne({[COMMON.DB_ID]: DIG_OUT(report, FEEDBACK.TARGET)}),
          plate => plate ? plate.addReport(report) : EXCEPTIONS.ITEM_NOT_FOUND,
          () => user ? user.addReport(report) : EXCEPTIONS.NOT_AUTHORIZED,
          () => report.save()
        )
      )
        .then(() => res.send({message: 'Thank you for your report. It will be checked as soon as possible'}))
        .catch(err => SEND_ERROR(res, err))
    },

    GET_COMMENTS = (req, res) => {
      const
        PlateModel = DatabaseModule.getModel(DB_MODELS.PLATE);

      PIPE(
        () => PlateModel.findOne({[COMMON.DB_ID]: DIG_OUT(req, REQ_PROPS.PARAMS, COMMON.ID)}),
        plate => plate ? DIG_OUT(plate, PLATE.COMMENTS) : EXCEPTIONS.ITEM_NOT_FOUND,
        comments => Object.keys(comments).map(key => comments[key])
      )
        .then(comments => res.send(comments))
        .catch(err => SEND_ERROR(res, err));
    };

  App.post(
    `/${ROUTES.FEEDBACK.ADD_COMMENT}/:${COMMON.ID}?`,
    MIDDLEWARES.ENSURE_AUTHENTICATION(),
    MIDDLEWARES.PREPARE_PARAMS(COMMON.ID),
    MIDDLEWARES.PREPARE_FORM(REQ_PROPS.FORM, [COMMON.TEXT, COMMON.ID]),
    ADD_COMMENT
  );

  App.post(
    `/${ROUTES.FEEDBACK.ADD_REPORT}/:${COMMON.ID}?`,
    MIDDLEWARES.ENSURE_AUTHENTICATION(true),
    MIDDLEWARES.PREPARE_PARAMS(COMMON.ID),
    MIDDLEWARES.PREPARE_FORM(REQ_PROPS.FORM, [COMMON.TEXT, COMMON.ID]),
    ADD_REPORT
  );

  App.get(
    `/${ROUTES.FEEDBACK.GET_COMMENTS}/:${COMMON.ID}?`,
    MIDDLEWARES.PREPARE_PARAMS(COMMON.ID),
    GET_COMMENTS
  );
};
