import {observable} from 'mobx';
import {AbstractObservable} from '../Abstract/Abstract.observable';
import {IS_NULL} from '../Core.helpers';

export class BooleanObservable extends AbstractObservable {
  
  protected readonly _initialValue: boolean;
  
  @observable
  protected _value: boolean;
  
  public toggleValue (state: any = null) {
    return this.setValue(IS_NULL(state) ? !this._value : !!state);
  }
  
  public setValue (value, save: boolean = false): this {
    return super.setValue(!!value);
  }
  
  constructor (initialValue: boolean = false) {
    super();
    this._initialValue = initialValue;
    this.resetValue();
  }
  
}