import {AbstractObservable} from '../Abstract/Abstract.observable';
import {action, computed, observable,  set, get, remove, keys} from 'mobx';
import {AS_FUNCTION, IS_OBJECT} from '../Core.helpers';
import {StringObservable} from './String.observable';
import {AbstractSubscription} from '../Abstract/Abstract.subscription';
import {NumberObservable} from './Number.observable';
import {AbstractObserver} from '../Abstract/Abstract.observer';

export class StructureObservable {
  
  private readonly _hash: NumberObservable = new NumberObservable();
  
  protected readonly _initialValue: any = {};

  @observable.shallow
  protected readonly _value: Map<string, any> = new Map<string, any>();
  
  private _refreshHash = () => {
    this._hash.setValue(this._hash.value + 1);
    return this;
  };
  
  @action
  private _refreshValue = (value: any, replace: boolean = false): this => {
    let
      shouldBeUpdated = false;
    
    if (IS_OBJECT(value)) {
      const
        {_value} = this;
      
      replace && _value.clear();
      
      Object.keys(value).forEach(key => {
        const
          next = value[key];
        
        shouldBeUpdated = shouldBeUpdated || !_value.has(key) || (_value.get(key) !== next);
        
        _value.set(key, value[key]);
      });
    }

    return shouldBeUpdated ? this._refreshHash() : this;
  };
  
  public setValue = (value, replace: boolean = true): this => this._refreshValue(value, replace);
  
  public setKey = (key, value): this => this._refreshValue({[key]: value});
  
  public removeKey = (key): this => this._value.has(key) ? this._refreshValue(Object.keys(this.value).reduce(
      (obj: any, _key: string) => Object.assign(
        obj, key !== _key ? {[_key]: this._value.get(_key)} : {}
      ),
    {}),  true
  ) : this;
  
  public clear = (): this => this._refreshValue({}, true);
  
  public resetValue = (): this => this.setValue(this._initialValue);
  
  public hasKey = (key): boolean => this._value.has(key);
  
  public getKey = (key): any => this._value.get(key);
  
  public subscribe = (fn, skipFirstCall: boolean = false): AbstractSubscription => this._hash.subscribe(
    () => AS_FUNCTION(fn, this.value), skipFirstCall
  );
  
  public subscribeOnNext (fn): AbstractSubscription {
    let subscription: AbstractSubscription;
    
    subscription = this.subscribe(val => {
      subscription && subscription.unsubscribe();
      AS_FUNCTION(fn, val);
    }, true);
    
    return subscription;
  }
  
  public toPromise () {
    return new Promise(resolve => this.subscribeOnNext(resolve));
  }
  
  @computed
  public get isEmpty(): boolean {
    return !this._value.size;
  }
  
  @computed
  public get value(): any {
    const
      _value = {};

    this._value.forEach((val, key) => _value[key] = val);
    return _value;
  }
  
  constructor(initialValue: any = {}) {
    this._initialValue = initialValue;
    this.resetValue();
  }
}

