import TP_FormInputModel from '../TP-FormInput.model';
import {StringObservable} from '../../../Core/Observables/String.observable';
import {SYMBOLS} from '../../../Core/Core.constants';
import {computed} from 'mobx';
import { IS_NOT_NULL, CHECK_AND_CALL, AS_ARRAY, IS_FUNCTION } from '../../../Core/Core.helpers';


export interface I_TP_InputSettings {
  validators?: any | null
}

export default class TP_StringInputModel extends TP_FormInputModel {

  public readonly core: StringObservable;

  public readonly settings: I_TP_InputSettings;

  public reset = (): TP_StringInputModel => {
    this.core.resetValue();
    return this;
  };

  public getDefaultSettings = (): I_TP_InputSettings => ({
    validators: null
  });

  @computed
  public get current (): string {
    return this.core.value;
  }

  @computed
  public get isValid (): boolean {
    const
      {core, settings} = this,
      {validators} = settings,
      val = core.value;

    return (IS_NOT_NULL(validators) ? validators.every(d => CHECK_AND_CALL(d, val)) : true);
  }

  constructor(fieldName: string,customSettings: I_TP_InputSettings = {}, initialValue: string = SYMBOLS.EMPTY_STRING) {
    super(fieldName);
    this.core = new StringObservable(initialValue);
    this.settings = Object.assign(this.getDefaultSettings(), customSettings);
    if (IS_NOT_NULL(this.settings.validators)) this.settings.validators = AS_ARRAY(this.settings.validators).filter(IS_FUNCTION);
  }

}

