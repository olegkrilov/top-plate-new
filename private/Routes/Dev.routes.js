const
  config = require('dotenv').config().parsed;

const
  CONSTANTS = require('../Common/Constants'),
  HELPERS = require('../Common/Helpers');

const
  {MODULES, DB_MODELS, REQ_PROPS, PROFILE, PLATE, FILE_PROPS, ENVIRONMENTS, ROUTES, COMMON} = CONSTANTS,
  {DIG_OUT, DIG_IN, PIPE, SEND_ERROR, GET_RANDOM_ID, ADD_UNIQUE, GET_WEEK_STAMP} = HELPERS,
  {APP_TEST_USER} = config;

module.exports = (App) => {

  const
    DatabaseModule = global[MODULES.DB],
    StorageModule = global[MODULES.STORAGE];

  const
    UserModel = DatabaseModule.getModel(DB_MODELS.APP_USER),
    PlateModel = DatabaseModule.getModel(DB_MODELS.PLATE);

  /** Handlers */
  const
    CREATE_RANDOM_PLATES = (req, res) => PIPE(
      () => UserModel.findOne({[PROFILE.EMAIL]: APP_TEST_USER}),
      User => new Promise((resolve, reject) => {
        const
          _getRandomFilePath = () => `_test_data/video_${Math.ceil(Math.random() * 2)}.mp4`,
          _createPlate = (_d = [], _n = DIG_OUT(req, REQ_PROPS.BODY, 'qty') || 10) => {
            if (!_n) resolve(_d);
            else {
              const
                Plate = new PlateModel({
                  [PLATE.NAME]: `test_plate_${GET_RANDOM_ID()}`,
                  [PLATE.ENV]: ENVIRONMENTS.HOMEMADE
                });

              PIPE(
                () => StorageModule.copyFile(
                  _getRandomFilePath(),
                  FILE_PROPS.VIDEO,
                  `${DIG_OUT(User, COMMON.DB_ID)}/${DIG_OUT(Plate, COMMON.DB_ID)}`
                ),
                pathToFile => DIG_IN(Plate, FILE_PROPS.VIDEO, pathToFile),
                () => DIG_IN(Plate, COMMON.INDEX, DIG_OUT(User, COMMON.DB_ID)),
                () => DIG_IN(Plate, PLATE.AUTHOR, User.getAsPlateAuthor()),
                () => DIG_IN(Plate, PLATE.WEEK, GET_WEEK_STAMP()),
                () => DIG_IN(Plate, PLATE.RECIPE, ''),
                () => DIG_IN(Plate, PLATE.INGREDIENTS, []),
                () => ADD_UNIQUE(DIG_OUT(User, PROFILE.UPLOADED_PLATES), DIG_OUT(Plate, COMMON.DB_ID)),
                () => User.save(),
                () => Plate.save(),
                () => _d.push(DIG_OUT(Plate, COMMON.DB_ID))
              )
                .then(() => _createPlate(_d, _n - 1))
                .catch(err => reject(err));
            }
          };

        _createPlate();
      })
    )
      .then(data => res.send(data))
      .catch(err => SEND_ERROR(res, err));

  /** Routes */
  App.post(
    `/${ROUTES.DEV.CREATE_RANDOM_PLATES}`,
    CREATE_RANDOM_PLATES
  );

};
