import {computed, observable} from 'mobx';
import {SYMBOLS} from '../Core.constants';
import {AbstractObservable} from '../Abstract/Abstract.observable';

export class StringObservable extends AbstractObservable {
  
  protected readonly _initialValue: string;
  
  @observable
  protected _value: string;
  
  public setValue (value): this {
    return super.setValue(`${value}`)
  }
  
  @computed
  public get length (): number {
    return `${this.value}`.length;
  }
  
  constructor (initialValue: string = SYMBOLS.EMPTY_STRING) {
    super();
    this._initialValue = initialValue;
    this.resetValue();
  }
  
}

