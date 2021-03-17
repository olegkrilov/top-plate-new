import {action, computed, observable} from 'mobx';
import {AbstractObserver} from './Abstract.observer';
import {AbstractSubscription} from './Abstract.subscription';
import {AS_ARRAY, AS_FUNCTION, IS_NOT_NULL, IS_NOT_UNDEFINED} from '../Core.helpers';

export class AbstractObservable {
  
  protected readonly _initialValue: any;
  
  @observable
  protected _value: any;
  
  @observable
  protected _savedValue: any;
  
  protected _observer: AbstractObserver | undefined;
  
  public resetValue (): this {
    return this.setValue(this._initialValue);
  }
  
  public subscribe (fn, skipFirstCall: boolean = false): AbstractSubscription {
    if (!this._observer) this._observer = new AbstractObserver(() => this.value);
    return this._observer.subscribe(fn, skipFirstCall);
  }
  
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
  
  @action
  public setValue (value): this {
    this._value = value;
    return this;
  }

  @action
  public saveValue () {
    this._savedValue = this._value;
    return this;
  }
  
  @computed
  public get value (): any {
    return this._value;
  }
  
  @computed
  public get hasChanges (): any {
    return IS_NOT_UNDEFINED(this._savedValue) && this._savedValue !== this.value;
  }
  
  @computed
  public get isObservable (): boolean {
    return true;
  }
  
}