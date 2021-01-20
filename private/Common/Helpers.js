const
  moment = require('moment');

const
  CONSTANTS = require('./Constants'),
  {FUNCTION, OBJECT, STRING} = CONSTANTS.TYPES,
  {REQ_PROPS} = CONSTANTS;

const
  IS_UNDEFINED = (val) => val === undefined,

  IS_NOT_UNDEFINED = (val) => !IS_UNDEFINED(val),

  IS_NULL = (val) => val === null,

  IS_NOT_NULL = (val) => !IS_NULL(val),

  IS_NULL_OR_UNDEFINED = val => IS_NULL(val) || IS_UNDEFINED(val),

  IS_FUNCTION = (val) => typeof val === FUNCTION,

  IS_STRING = (val) => typeof val === STRING && !!val.length,

  IS_ARRAY = (val) => Array.isArray(val),

  IS_OBJECT = (val) => typeof (val) === OBJECT && IS_NOT_NULL(val) && !IS_ARRAY(val),

  IS_PROMISE = (val) => val && IS_FUNCTION(val['then']),

  IS_TRUE = (val) => !!val,

  IS_BOOLEAN = (val) => val === true || val === false,

  AS_BOOLEAN = (val) => IS_BOOLEAN(val) ? val : (`${val}`.toLowerCase() === 'true'),

  AS_PROMISE = (val) => IS_PROMISE(val) ? val : new Promise(resolve => resolve(val)),

  AS_ARRAY = (val) => IS_ARRAY(val) ? val : (IS_NULL_OR_UNDEFINED(val) ? [] : [val]),

  AS_FUNCTION = (...args) => {
    let
      _args = Array.from(args),
      _fn = _args.splice(0, 1)[0];
    return IS_FUNCTION(_fn) && _fn.apply(null, _args);
  },

  ADD_UNIQUE = (arr, val) => {
    const
      _arr = AS_ARRAY(arr);
    !_arr.includes(val) && _arr.push(val);
    return _arr;
  },

  REMOVE_UNIQUE = (arr, val) => {
    const
      _arr = AS_ARRAY(arr);
    _arr.includes(val) && _arr.splice(_arr.indexOf(val), 1);
    return _arr;
  },

  DO_NOTHING = () => undefined,

  DIG_OUT = (..._args) => {
    let
      args = Array.from(_args),
      base = args.splice(0, 1)[0],
      i = 0;

    try {
      let
        val = (base && base[args[i]]) || undefined,
        len = args.length;

      if (val) while ((len - 1) > i++) {
        let _val = val[args[i]];
        if (IS_NOT_UNDEFINED(_val)) {
          val = _val;
        } else {
          val = undefined;
          i = len;
        }
      }
      return val;
    } catch (err) {
      return undefined;
    }
  },

  DIG_IN = (..._args) => {
    const
      args = Array.from(_args),
      target = args.shift();

    let
      base = target,
      val = args.pop(),
      targetKey = args.pop(),
      len = args.length,
      i = 0;

    if (targetKey) {
      try {
        while (len > i++) {
          const
            key = args.shift();

          base[key] = base[key] || {};
          base = base[key];
        }

        base[targetKey] = val;
      } catch (e) {
        DO_NOTHING();
      }
    } else {
      DO_NOTHING();
    }

    return target;
  },

  PIPE = (...args) => new Promise((resolve, reject) => {
    const
      _args = Array.from(args);

    const
      gotError = (val) => IS_OBJECT(val) && val['error'],

      doStep = (val, i = 0) => {
        try {
          if (gotError(val)) {
            _args.length = 0;
            reject(val);
          } else {
            let step = _args[i];
            IS_UNDEFINED(step) ?
              resolve(val) :
              (IS_PROMISE(step) ? step : AS_PROMISE(IS_FUNCTION(step) ? AS_FUNCTION(step, val) : step))
                .then(_val => doStep(_val, ++i))
                .catch(err => reject(err));
          }
        } catch (err) {
          reject(err);
        }
      };

    doStep();
  }),

  GET_MONTH_STAMP = () => moment().format('YYYY_M'),

  GET_WEEK_STAMP = () => moment().format('YYYY_M_W'),

  SEND_ERROR = (res, err) => res
    .status(DIG_OUT(err, 'status') || DIG_OUT(err, 'statusCode') || 500)
    .send(DIG_OUT(err, 'message') || `${err}` || 'Uncaught Error'),

  GET_FILE_EXTENSION = contentType => ({
    'image/png': 'png',
    'image/gif': 'gif',
    'image/jpeg': 'jpg',

    'video/x-flv': 'flv',
    'video/mp4': 'mp4',
	  'application/x-mpegURL': 'm3u8',
  	'video/MP2T': 'ts',
  	'video/3gpp': '3gp',
  	'video/quicktime': 'mov',
  	'video/x-msvideo': 'avi',
    'video/x-ms-wmv': 'wmv'
  }[contentType]),

  GET_RANDOM_ID = (size = 9) =>
    `${new Date().getTime()}${Math.random().toString(36).substr(2, size)}`,

  GET_FROM_BODY = (req, prop) => DIG_OUT(req, REQ_PROPS.BODY, prop) || null,

  GET_FROM_PARAMS = (req, prop) => DIG_OUT(req, REQ_PROPS.PARAMS, prop) || null,

  GET_FROM_FIELDS = (req, prop) => DIG_OUT(req, REQ_PROPS.FORM, REQ_PROPS.FIELDS, prop) || null,

  GET_FROM_FILES = (req, prop) => DIG_OUT(req, REQ_PROPS.FORM, REQ_PROPS.FILES, prop) || null,

  IS_MULTIPART_FORM = (req) => /^multipart\/form-data/.test(DIG_OUT(req, REQ_PROPS.HEADERS, REQ_PROPS.CONTENT_TYPE));

module.exports = {
  IS_UNDEFINED,
  IS_NOT_UNDEFINED,
  IS_NULL,
  IS_NOT_NULL,
  IS_NULL_OR_UNDEFINED,
  IS_FUNCTION,
  IS_STRING,
  IS_ARRAY,
  IS_OBJECT,
  IS_PROMISE,
  IS_TRUE,
  IS_BOOLEAN,
  IS_MULTIPART_FORM,
  AS_BOOLEAN,
  AS_ARRAY,
  AS_PROMISE,
  ADD_UNIQUE,
  REMOVE_UNIQUE,
  DO_NOTHING,
  AS_FUNCTION,
  DIG_OUT,
  DIG_IN,
  PIPE,
  GET_MONTH_STAMP,
  GET_WEEK_STAMP,
  SEND_ERROR,
  GET_FILE_EXTENSION,
  GET_RANDOM_ID,
  GET_FROM_BODY,
  GET_FROM_PARAMS,
  GET_FROM_FIELDS,
  GET_FROM_FILES
};

