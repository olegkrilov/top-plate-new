const
  CONSTANTS = require('../Common/Constants'),
  HELPERS = require('../Common/Helpers'),
  MIDDLEWARES = require('../Common/Middlewares'),
  EXCEPTIONS = require('../Common/Exceptions'),
  FORM_KEYS = require('../Common/FormKeys');

const
  {
    COMMON, MODULES, DB_MODELS, REQ_PROPS,
    PROFILE, FILE_PROPS, SPECIAL_KEYS,
    ROUTES, PLATE, ENVIRONMENTS, FEEDBACK, FEEDBACK_TYPES
  } = CONSTANTS,
  {
    DIG_OUT, DIG_IN, PIPE, SEND_ERROR,
    ADD_UNIQUE, GET_WEEK_STAMP, AS_ARRAY,
    AS_BOOLEAN, IS_NULL, IS_NOT_NULL, IS_TRUE} = HELPERS;

const
  DEFAULT_LIMIT = 12,
  DEFAULT_ENV = ENVIRONMENTS.HOMEMADE;

module.exports = (App) => {

  const
    DatabaseModule = global[MODULES.DB],
    StorageModule = global[MODULES.STORAGE];

  /** Privates */
  const
    _LOAD_PLATES = (query = {}, limit = DEFAULT_LIMIT, cursor = null, revert = false) => {
      const
        PlateModel = DatabaseModule.getModel(DB_MODELS.PLATE);

      return PIPE(
        () => cursor && PIPE(
          () => PlateModel.findOne({[COMMON.DB_ID]: cursor}),
          lastRecord => lastRecord && Object.assign(query, {
            [SPECIAL_KEYS.CREATED_AT]: {$lt: DIG_OUT(lastRecord, SPECIAL_KEYS.CREATED_AT)}
          })
        ),
        () => PlateModel.find(query)
          .sort({[SPECIAL_KEYS.CREATED_AT]: AS_BOOLEAN(revert) ? 1 : -1})
          .limit(limit)
      );
    },

    _DEFINE_LIMIT = (req, defaultVal = DEFAULT_LIMIT) =>
      +(DIG_OUT(req, REQ_PROPS.PARAMS, REQ_PROPS.LIMIT) || defaultVal),

    _DEFINE_CURSOR = (req, defaultVal = null) =>
      DIG_OUT(req, REQ_PROPS.PARAMS, REQ_PROPS.CURSOR) || defaultVal,

    _LOAD_NORMALIZED_PLATES = (req, collection) => {
      return PIPE(
        () => _LOAD_PLATES(
          {
            [PLATE.ENV]: DIG_OUT(req, REQ_PROPS.PARAMS, PLATE.ENV) || DEFAULT_ENV,
            [SPECIAL_KEYS.IS_READY]: true,
            [COMMON.DB_ID]: {$in: AS_ARRAY(DIG_OUT(req, PROFILE.USER, collection))}
          },
          _DEFINE_LIMIT(req),
          _DEFINE_CURSOR(req)
        ),
        plates => plates.map(plate => plate.getNormalized())
      )
    },
    
    _GET_LIST_BY_HASHTAG = (hashtags, query) => {
      let
        listOfIds = null;
    
      return PIPE(
        () => DatabaseModule.getModel(DB_MODELS.HASHTAG).find({[COMMON.LABEL]: {$in: hashtags}}),
        _hashtags => _hashtags.forEach(d => {
          const
            usedIn = AS_ARRAY(DIG_OUT(d, SPECIAL_KEYS.USED_IN));
        
          if (IS_NULL(listOfIds)) listOfIds = [...usedIn];
          else listOfIds.forEach((id, index) => listOfIds[index] = usedIn.includes(id) ? id : null);
          
          listOfIds = listOfIds.filter(IS_NOT_NULL);
        }),
        () => Object.assign(query, {[COMMON.DB_ID]: {$in: listOfIds}})
      );
    };

  /** Handlers */
  const
    GET_PLATES = (req, res) => {
      const
        query = {
          [PLATE.ENV]: DIG_OUT(req, REQ_PROPS.PARAMS, PLATE.ENV) || DEFAULT_ENV,
          [SPECIAL_KEYS.IS_READY]: true
        },
        hashtags = (DIG_OUT(req, REQ_PROPS.PARAMS, PLATE.HASHTAGS) || '')
          .split(SPECIAL_KEYS.COMMA_SEPARATOR)
          .filter(IS_TRUE);
      
      PIPE(
        () => hashtags.length && _GET_LIST_BY_HASHTAG(hashtags, query),
        () => _LOAD_PLATES(
          query,
          _DEFINE_LIMIT(req),
          _DEFINE_CURSOR(req)
        ),
        plates => plates.map(plate => plate.getNormalized())
      )
        .then(plates => res.send(plates))
        .catch(err => SEND_ERROR(res, err))
    },

    GET_PLATE = (req, res) => {
      const
        PlateModel = DatabaseModule.getModel(DB_MODELS.PLATE),
        UserModel = DatabaseModule.getModel(DB_MODELS.APP_USER);

      const
        id = DIG_OUT(req, REQ_PROPS.PARAMS, COMMON.ID),
        limit = _DEFINE_LIMIT(req, 0);

      const
        _prepareRelatedPlates = plate => PIPE(
          () => UserModel.findOne({[COMMON.DB_ID]: DIG_OUT(plate, COMMON.INDEX)}),

          user => _LOAD_PLATES(
            {
              [COMMON.DB_ID]: {
                $in: AS_ARRAY(DIG_OUT(user, PROFILE.UPLOADED_PLATES)).filter(id => id !== DIG_OUT(plate, COMMON.DB_ID))
              },
              [PLATE.ENV]: DIG_OUT(plate, PLATE.ENV),
              [SPECIAL_KEYS.IS_READY]: true
            },
            limit
          ),
          relatedPlates => DIG_IN(plate, PLATE.RELATED_PLATES, relatedPlates.map(_plate => _plate.getNormalized()))
        );

      id ?
        PIPE(
          () => PlateModel.findOne({[COMMON.DB_ID]: id}),
          plate => plate ? plate.getNormalized() : EXCEPTIONS.ITEM_NOT_FOUND,
          plate => limit ? _prepareRelatedPlates(plate) : plate
        )
          .then(plate => res.send(plate))
          .catch(err => SEND_ERROR(res, err)) : SEND_ERROR(res, EXCEPTIONS.BAD_REQUEST);
    },

    ADD_PLATE = (req, res) => {
      const
        User = DIG_OUT(req, PROFILE.USER),
        {fields, files} = DIG_OUT(req, REQ_PROPS.FORM);
      
      const
        _createPlate = () => PIPE(
          () => DatabaseModule.getModel(DB_MODELS.PLATE),
          Model => new Model(fields)
        ),

        _addContent = Plate => PIPE(
          () => StorageModule.saveFile(
            DIG_OUT(files, FILE_PROPS.VIDEO),
            FILE_PROPS.VIDEO,
            `${DIG_OUT(User, COMMON.DB_ID)}/${DIG_OUT(Plate, COMMON.DB_ID)}`
          ),
          pathToFile => DIG_IN(Plate, FILE_PROPS.VIDEO, pathToFile)
        ),

        _addHashTags = Plate => {
          const
            Hashtag = DatabaseModule.getModel(DB_MODELS.HASHTAG),
            listOfHashtags = ADD_UNIQUE(
              (DIG_OUT(fields, PLATE.HASHTAGS) || SPECIAL_KEYS.EMPTY_STRING)
                .split(SPECIAL_KEYS.COMMA_SEPARATOR)
                .map(key => `${key}`.trim()),
              DIG_OUT(Plate, PLATE.ENV)),
            plateID = DIG_OUT(Plate, COMMON.DB_ID);

          const
            _addHashtag = (_i = 0) => {
              const
                hashtag = listOfHashtags[_i],
                query = {[COMMON.LABEL]: hashtag}

              return hashtag ?
                PIPE(
                  () => Hashtag.findOne(query),
                  hashtagModel => hashtagModel || new Hashtag(query),
                  hashtagModel => hashtagModel.associateWithPlate(plateID),
                  () => _addHashtag(_i + 1)
                ) :
                DIG_IN(Plate, PLATE.HASHTAGS, listOfHashtags);
            };

          return _addHashtag();
        },

        _addAuthor = Plate => PIPE(
          () => ADD_UNIQUE(DIG_OUT(User, PROFILE.UPLOADED_PLATES), DIG_OUT(Plate, COMMON.DB_ID)),
          () => User.save(),
          () => DIG_IN(Plate, COMMON.INDEX, DIG_OUT(User, COMMON.DB_ID)),
          () => DIG_IN(Plate, PLATE.AUTHOR, User.getAsPlateAuthor())
        ),

        _save = Plate => PIPE(
          () => DIG_IN(Plate, PLATE.WEEK, GET_WEEK_STAMP()),
          () => DIG_IN(Plate, PLATE.RECIPE, ''),
          () => DIG_IN(Plate, PLATE.INGREDIENTS, []),
          () => Plate.save()
        );

      PIPE(
        _createPlate,
        _addContent,
        _addHashTags,
        _addAuthor,
        _save
      )
        .then(Plate => res.send(Plate.getNormalized()))
        .catch(err => SEND_ERROR(res, err));
    },

    LIKE_PLATE = (req, res) => {
      const
        PlateModel = DatabaseModule.getModel(DB_MODELS.PLATE);

      const
        user = DIG_OUT(req, PROFILE.USER),
        id = DIG_OUT(req, REQ_PROPS.PARAMS, COMMON.ID);

      id ? PIPE(
        () => PlateModel.findOne({[COMMON.DB_ID]: id}),
        plate => plate ? PIPE(
          () => plate.likeIt(DIG_OUT(user, COMMON.DB_ID)),
          () => user.likePlate(id),
          () => plate.getNormalized(true)
        ) : EXCEPTIONS.ITEM_NOT_FOUND,
      )
        .then(plate => res.send(plate))
        .catch(err => SEND_ERROR(res, err)) : SEND_ERROR(res, EXCEPTIONS.BAD_REQUEST);
    },

    DISLIKE_PLATE = (req, res) => {
      const
        PlateModel = DatabaseModule.getModel(DB_MODELS.PLATE);

      const
        user = DIG_OUT(req, PROFILE.USER),
        id = DIG_OUT(req, REQ_PROPS.PARAMS, COMMON.ID);

      id ? PIPE(
        () => PlateModel.findOne({[COMMON.DB_ID]: id}),
        plate => plate ? plate.dislikeIt(DIG_OUT(user, COMMON.DB_ID)) : EXCEPTIONS.ITEM_NOT_FOUND,
        plate => user.dislikePlate(id) && plate.getNormalized()
      )
        .then(plate => res.send(plate))
        .catch(err => SEND_ERROR(res, err)) : SEND_ERROR(res, EXCEPTIONS.BAD_REQUEST);
    },

    GET_LIKED_PlATES = (req, res) => {
      _LOAD_NORMALIZED_PLATES(req, PROFILE.LIKED_PLATES)
        .then(plates => res.send(plates))
        .catch(err => SEND_ERROR(res, err))
    },

    GET_OWN_PLATES = (req, res) => {
      _LOAD_NORMALIZED_PLATES(req, PROFILE.UPLOADED_PLATES)
        .then(plates => res.send(plates))
        .catch(err => SEND_ERROR(res, err))
    };

  /** Routes */
  App.get(
    `/${ROUTES.CONTENT.GET_PLATES}/:${PLATE.ENV}?/:${REQ_PROPS.LIMIT}?/:${REQ_PROPS.CURSOR}?/:${PLATE.HASHTAGS}?`,
    MIDDLEWARES.PREPARE_PARAMS(FORM_KEYS.GET_PLATES_FORM),
    GET_PLATES
  );

  App.get(
    `/${ROUTES.CONTENT.GET_PLATE}/:${COMMON.ID}?/:${REQ_PROPS.LIMIT}?`,
    MIDDLEWARES.PREPARE_PARAMS(FORM_KEYS.GET_PLATE_FORM),
    GET_PLATE
  );

  App.get(
    `/${ROUTES.CONTENT.GET_LIKED_PlATES}/:${PLATE.ENV}?/:${REQ_PROPS.LIMIT}?/:${REQ_PROPS.CURSOR}?`,
    MIDDLEWARES.ENSURE_AUTHENTICATION(),
    MIDDLEWARES.PREPARE_PARAMS(FORM_KEYS.GET_PLATES_FORM),
    GET_LIKED_PlATES
  );

  App.get(
    `/${ROUTES.CONTENT.GET_OWN_PLATES}/:${PLATE.ENV}?/:${REQ_PROPS.LIMIT}?/:${REQ_PROPS.CURSOR}?`,
    MIDDLEWARES.ENSURE_AUTHENTICATION(),
    MIDDLEWARES.PREPARE_PARAMS(FORM_KEYS.GET_PLATES_FORM),
    GET_OWN_PLATES
  );

  App.post(
    `/${ROUTES.CONTENT.LIKE_PLATE}/:${COMMON.ID}?`,
    MIDDLEWARES.ENSURE_AUTHENTICATION(true),
    MIDDLEWARES.PREPARE_PARAMS(COMMON.ID),
    LIKE_PLATE
  );

  App.post(
    `/${ROUTES.CONTENT.DISLIKE_PLATE}/:${COMMON.ID}?`,
    MIDDLEWARES.ENSURE_AUTHENTICATION(true),
    MIDDLEWARES.PREPARE_PARAMS(COMMON.ID),
    DISLIKE_PLATE
  );

  App.post(
    `/${ROUTES.CONTENT.ADD_PLATE}`,
    MIDDLEWARES.ENSURE_AUTHENTICATION(true),
    MIDDLEWARES.PREPARE_FORM(REQ_PROPS.FORM),
    MIDDLEWARES.CHECK_REQUIRED_FIELDS(FORM_KEYS.ADD_PLATE_FORM_FIELDS),
    MIDDLEWARES.CHECK_REQUIRED_FILES(FORM_KEYS.ADD_PLATE_FORM_FILES),
    ADD_PLATE
  );

};
