import {AbstractObservable} from '../Abstract/Abstract.observable';
import {observable} from 'mobx';

export class NumberObservable extends AbstractObservable {
  
  protected readonly _initialValue: number;
  
  @observable
  protected _value: number;
  
  public setValue (value, save: boolean = false): this {
    return super.setValue(+value);
  }
  
  constructor (initialValue: number = 0) {
    super();
    this._initialValue = initialValue;
    this.resetValue();
  }
  
}

