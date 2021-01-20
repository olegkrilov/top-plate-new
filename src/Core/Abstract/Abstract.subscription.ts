import {AS_FUNCTION} from '../Core.helpers';
import {computed, IComputedValue} from 'mobx';

export class AbstractSubscription {
  
  private static _index: number = 0;
  
  public readonly id: string = `AbstractSubscription#${AbstractSubscription._index++}`;
  
  private readonly _ra: any;
  
  private readonly _cs: any;
  
  public readonly getObserver: any;
  
  public callReaction (): this {
    AS_FUNCTION(this._ra);
    return this;
  }
  
  public unsubscribe (): this {
    AS_FUNCTION(this._cs);
    return this;
  }
  
  constructor (reaction: any, observer: IComputedValue<any>) {
    this.getObserver = () => observer;
    this._ra = () => AS_FUNCTION(reaction, observer.get());
    this._cs = observer.observe(() => this.callReaction());
  }
}

