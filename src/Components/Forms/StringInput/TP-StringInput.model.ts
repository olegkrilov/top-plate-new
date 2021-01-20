import TP_FormInputModel from '../TP-FormInput.model';
import {StringObservable} from '../../../Core/Observables/String.observable';
import {SYMBOLS} from '../../../Core/Core.constants';
import {computed} from 'mobx';


export default class TP_StringInputModel extends TP_FormInputModel {

  public readonly core: StringObservable;

  public reset = (): TP_StringInputModel => {
    this.core.resetValue();
    return this;
  };

  @computed
  public get current (): string {
    return this.core.value;
  }

  constructor(fieldName: string, initialValue: string = SYMBOLS.EMPTY_STRING) {
    super(fieldName);
    this.core = new StringObservable(initialValue);
  }

}

