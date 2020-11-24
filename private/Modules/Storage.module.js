const
  fs = require('fs'),
  jimp = require('jimp');

const
  AbstractModule = require('./Abstract.module');

const
  CONSTANTS = require('../Common/Constants'),
  HELPERS = require('../Common/Helpers'),
  EXCEPTIONS = require('../Common/Exceptions');

const
  {STORAGE, COMMON, FILE_PROPS} = CONSTANTS,
  {PIPE, DIG_OUT, GET_FILE_EXTENSION, GET_RANDOM_ID, IS_TRUE} = HELPERS;

const
  _createFolder = src => {
    const
      _path = src
        .replace(/^.\//, '')
        .split('/')
        .reduce((agg, str) => {
          const
            _last = agg[agg.length - 1];

          agg.push((_last ? `${_last}/` : './') + str);

          return agg;
        }, []);

    const
      __createFolder = (i = 0) => {
        const
          _nextPath = _path[i];

        if (_nextPath) {
          !fs.existsSync(_nextPath) && fs.mkdirSync(_nextPath);
          return __createFolder(i + 1);
        } else return this;
      };

    return __createFolder();
  },

  _saveFile = (tmpPath, destPath, fileName) => {
    const
      fullPath = `${destPath}/${fileName}`;

    return PIPE(
      () =>  _createFolder(destPath),
      () => fs.readFileSync(tmpPath),
      binaryData => fs.writeFileSync(`./${fullPath}`, binaryData),
      () => fullPath
    );
  };

class StorageModule extends AbstractModule {

  init = () => PIPE(
    () => _createFolder(STORAGE.ROOT_DIR),
    () => this
  );

  createFolder = src => _createFolder(src);

  saveFile = (file, prefix = '', savePath = '') => {
    const
      contentType = DIG_OUT(file, COMMON.TYPE),
      fileExt = GET_FILE_EXTENSION(contentType),
      fileName = `${prefix}_${GET_RANDOM_ID()}`,
      targetFolder = `${STORAGE.ROOT_DIR}${savePath ? '/' + savePath : ''}`;

    return _saveFile(
      DIG_OUT(file, COMMON.PATH),
      `${targetFolder}`,
      `${fileName}.${fileExt}`
    );
  };
}

module.exports = StorageModule;
