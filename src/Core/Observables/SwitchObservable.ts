import {action, computed, observable} from 'mobx';
import {AbstractObservable} from '../Abstract/Abstract.observable';
import {IS_NULL} from '../Core.helpers';

export class SwitchObservable extends AbstractObservable {

  protected readonly _initialValue: boolean;

  @observable
  protected _value: boolean;

  public toggleValue (state: any = null) {
    return this.setValue(IS_NULL(state) ? !this._value : !!state);
  }

  @action
  public setValue (value, save: boolean = false): this {
    this._value = !!value;
    return save ? this.saveValue() : this;
  }

  constructor (initialValue: boolean = false) {
    super();
    this._initialValue = initialValue;
    this.resetValue();
  }

}