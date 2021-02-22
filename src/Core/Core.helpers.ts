import {TYPES, ASYNC} from './Core.constants';

export const
  
  IS_UNDEFINED = (val: any): boolean => val === undefined,

  IS_NOT_UNDEFINED = (val: any): boolean => !IS_UNDEFINED(val),

  IS_NULL = (val: any): boolean => val === null,

  IS_NOT_NULL = (val: any): boolean => !IS_NULL(val),

  IS_FUNCTION = (val: any): boolean => typeof val === TYPES.FUNCTION,

  IS_STRING = (val: any): boolean => typeof val === TYPES.STRING && !!val.length,

  IS_ARRAY = (val: any): boolean => Array.isArray(val),

  IS_OBJECT = (val: any): boolean => typeof(val) === TYPES.OBJECT && IS_NOT_NULL(val) && !IS_ARRAY(val),

  IS_PROMISE = (val: any) => val && IS_FUNCTION(val[ASYNC.THEN]),

  CHECK_AND_CALL = (..._args) => {
    let
      args = Array.from(_args),
      fn = args.splice(0, 1)[0];
    return IS_FUNCTION(fn) && fn.apply(null, args);
  },

  AS_FUNCTION = (..._args) => {
    const
      args = Array.from(_args),
      fn = args.splice(0, 1)[0];
    return IS_FUNCTION(fn) && fn.apply(null, args);
  },

  AS_ARRAY = (val: any): any[] => IS_ARRAY(val) ? val : [val],

  IS_IN_ARRAY = (val: any, arr: any) => AS_ARRAY(arr).includes(val),

  NOT_IN_ARRAY = (val: any, arr: any) => !IS_IN_ARRAY(val, arr),

  DO_NOTHING = () => {},

  LOG_IT = (something: any) => console.log(something),

  GET_NULL = () => null,

  GET_TRUE = () => true,

  GET_FALSE = () => false,

  CHECK_CLICK_TARGET = (root, target): boolean => {
    let clickedInside = false;
    
    while (target) {
      if (target === root) {
        target = null;
        clickedInside = true;
      } else target = target.parentNode || null;
    }
    
    return clickedInside;
  },

  PARENT_HAS_CLASS = (target: any, className: string): boolean => {
    let
      _hasClass = false,
      _target = target;
    
    while (_target) {
      _hasClass = !!_target.classList && _target.classList.contains(className);
      _target = _hasClass ? null : _target.parentNode;
    }
    
    return _hasClass;
  },

  GET_PROPERTIES = (obj: any, keys: any): any => {
    const _props = {};
    IS_OBJECT(obj) && AS_ARRAY(keys).forEach(key => IS_STRING(key) && (_props[key] = obj[key]));
    return _props;
  },

  DIG_OUT = (..._args) => {
    let
      args = Array.from(_args),
      base = args.shift(),
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
  
  AWAIT = async (delay: number = 0, res: any | null = null) => new Promise(
    resolve => setTimeout(() => resolve(res), delay)
  ),

  RUN_SAFELY = (action, onError: any = DO_NOTHING) => {
    try {
      AS_FUNCTION(action);
    } catch (err) {
      AS_FUNCTION(onError, err);
    }
  },

  AS_PROMISE = (val) => IS_PROMISE(val) ? val : new Promise(resolve => resolve(val)),

  PIPE = (...args) => new Promise((resolve, reject) => {
    const
      _args = Array.from(args);
    
    const
      gotError = (err) => {
        _args.length = 0;
        reject(err);
        return true;
      },
      
      checkError = (val) => (IS_OBJECT(val) && val['error'] ? gotError(val) : false),
      // checkError = (val) => (IS_OBJECT(val) && val['error'] && !(val['error'] instanceof StructureObservable)) ? gotError(val) : false,
      
      doStep = (val = undefined, i = 0) => {
        try {
          if (!checkError(val)) {
            let step = _args[i];
            !step ? resolve(val) :
              AS_PROMISE(IS_PROMISE(step) ? step : (IS_FUNCTION(step) ? AS_FUNCTION(step, val) : () => step))
                .then(_val => doStep(_val, ++i))
                .catch(err => gotError(err));
          }
        } catch (err) {
          reject(err);
        }
      };
    
    doStep();
  });
