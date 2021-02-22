import {
    GET_TRUE,
    IS_NOT_NULL,
    IS_NOT_UNDEFINED
} from '../../Core/Core.helpers';
import {EMAIL_REG_EXP, PASSWORD_REG_EXP} from '../TP_RegularExpressions.cnst'

export const
  ALWAYS_TRUE = () => GET_TRUE,

  IS_REQUIRED = () => (val) => IS_NOT_NULL(val) && IS_NOT_UNDEFINED(val) && (`${val}`.length > 0),

  IS_VALID_REG_EXP = (regExp) => (val) => regExp.test(val),

  IS_VALID_EMAIL = () => {
    let validator = IS_VALID_REG_EXP(EMAIL_REG_EXP);
    return val => validator(val);
  },

  IS_VALID_PASSWORD = () => {
      let validator = IS_VALID_REG_EXP(PASSWORD_REG_EXP);
      return val => validator(val);
  }

