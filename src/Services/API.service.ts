import axios from 'axios';
import {AS_PROMISE, DIG_OUT, PIPE} from '../Core/Core.helpers';
import {COMMON} from '../Core/Core.constants';
import {API_PROPS} from '../Common/API.enum';

export interface IAPIError {
  [COMMON.ERROR]: boolean,
  [API_PROPS.STATUS]: number,
  [API_PROPS.STATUS_TEXT]: string
}

export class APIService {
  
  private static _getDefaultError = (): IAPIError => ({
    [COMMON.ERROR]: true,
    [API_PROPS.STATUS]: 500,
    [API_PROPS.STATUS_TEXT]: 'Something went wrong'
  });
  
  private _handleError = (err, defaultError: IAPIError = APIService._getDefaultError()): IAPIError => {
    const
      errStatus = DIG_OUT(err.response, API_PROPS.STATUS),
      errMessage = DIG_OUT(err.response, COMMON.DATA) || DIG_OUT(err.response, API_PROPS.STATUS_TEXT);

    return Object.assign(
      defaultError,
      errStatus ? {[API_PROPS.STATUS]: errStatus} : {},
      errMessage ? {[API_PROPS.STATUS_TEXT]: errMessage} : {},
    );
  };
  
  private _handleResult = res => DIG_OUT(res, COMMON.DATA);
  
  public sendGet = (url, params: any = {}) => axios.get(
    url, {[COMMON.PARAMS]: params, [API_PROPS.WITH_CREDENTIALS]: true}
  )
    .then(this._handleResult)
    .catch(this._handleError);
  
  public sendPost = (url, data: any = {}) => axios.post(
    url, data, {[API_PROPS.WITH_CREDENTIALS]: true}
  )
    .then(this._handleResult)
    .catch(this._handleError);
}

export default new APIService();

