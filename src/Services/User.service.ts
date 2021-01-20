import {StructureObservable} from '../Core/Observables/Structure.observable';
import {ACCESS_LEVELS, PROFILE, ROUTING_PROPS} from '../Common/Constants.enum';
import {COMMON, SYMBOLS} from '../Core/Core.constants';
import {DIG_OUT, PIPE} from '../Core/Core.helpers';
import {computed} from 'mobx';
import apiService from './API.service';
import {AUTHORIZATION_API, PROFILE_API} from '../Common/API.enum';

export interface IUserCredentials {
  [PROFILE.EMAIL]: string,
  [PROFILE.PASSWORD]: string
}

export interface IUserProfile {
  [COMMON.DB_ID]: string,
  [PROFILE.EMAIL]?: string,
  [COMMON.USER]: {
    [COMMON.NAME]: string,
    [PROFILE.EMAIL]?: string,
    [PROFILE.FIRST_NAME]?: string,
    [PROFILE.LAST_NAME]?: string,
    [PROFILE.IMAGE]?: string
  },
  [PROFILE.LIKED_PLATES]?: any,
  [PROFILE.SUBSCRIPTIONS]?: any,
  [PROFILE.WARNINGS]?: any[],
  [ROUTING_PROPS.ACCESS]: string
}

export class UserService {
  
  private static _getDefaultProfile = (): IUserProfile => ({
    [COMMON.DB_ID]: SYMBOLS.EMPTY_STRING,
    [ROUTING_PROPS.ACCESS]: ACCESS_LEVELS.GUEST,
    [COMMON.USER]: {
      [COMMON.NAME]: ACCESS_LEVELS.GUEST.toUpperCase()
    }
  });
  
  private readonly _user: StructureObservable = new StructureObservable(UserService._getDefaultProfile());

  public setUserData = (userData, isAuthorized: boolean = false) => PIPE(
    () => this._user.setValue(Object.assign(userData, {[ROUTING_PROPS.ACCESS]: isAuthorized
        ? (userData.isAdmin
            ? ACCESS_LEVELS.ADMIN
            : ACCESS_LEVELS.USER
        )
        : ACCESS_LEVELS.GUEST
    })),
    () => this
  );

  public login = (credentials: IUserCredentials) => PIPE(
    () => apiService.sendPost(AUTHORIZATION_API.LOGIN_LOCAL, credentials),
    userData => this.setUserData(userData, true),
    () => this._user.value
  );
  
  public fetch = () => PIPE(
    () => apiService.sendGet(PROFILE_API.GET_PROFILE),
    userData => this.setUserData(userData, true),
    () => this._user.value
  );
  
  public logout = () => PIPE(
    () => apiService.sendGet(AUTHORIZATION_API.LOGOUT),
    () => this._user.resetValue(),
    () => this._user.value
  );
  
  @computed
  public get isAuthorized (): boolean {
    return DIG_OUT(this.user, ROUTING_PROPS.ACCESS) !== ACCESS_LEVELS.GUEST;
  }
  
  @computed
  public get isAdmin (): boolean {
    return DIG_OUT(this._user.value, ROUTING_PROPS.ACCESS) === ACCESS_LEVELS.ADMIN;
  }
  
  @computed
  public get user (): IUserProfile {
    return this._user.value;
  }
  
}

export default new UserService();