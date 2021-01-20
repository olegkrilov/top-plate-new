import {AS_FUNCTION, IS_FUNCTION, IS_NULL} from '../Core.helpers';
import {computed, IComputedValue} from 'mobx';
import {AbstractSubscription} from './Abstract.subscription';

export class AbstractObserver {
  
  private static _index: number = 0;
  
  public readonly id: string;
  
  private readonly _getValue: any;
  
  private readonly _subscriptions: any = {};
  
  private _observer: IComputedValue<any> | null | any = null;
  
  private _getObserver () {
    this._observer = IS_NULL(this._observer) ? computed(() => this._getValue()) : this._observer;
    return this._observer;
  }
  
  public subscribe (callback, skipFirstCall: boolean = false): AbstractSubscription {
    const
      newSubscription = new AbstractSubscription(callback, this._getObserver());
    !skipFirstCall && newSubscription.callReaction();
    return newSubscription;
  }
  
  @computed public get currentValue () {
    return AS_FUNCTION(this._getValue);
  }
  
  constructor (getValue) {
    this.id = `AbstractObserver#${AbstractObserver._index++}`;
    this._getValue = IS_FUNCTION(getValue) ? getValue : () => getValue;
  }
  
}

