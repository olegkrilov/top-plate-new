import {StructureObservable} from './Structure.observable';
import {COMMON, EVENTS} from '../Core.constants';
import {AS_FUNCTION, DO_NOTHING, PIPE} from '../Core.helpers';
import {AbstractSubscription} from '../Abstract/Abstract.subscription';

export interface IEvent {
  [COMMON.TYPE]: string,
  [COMMON.TIMESTAMP]: number,
  [COMMON.ORIGIN]: any,
  [COMMON.DATA]: any
}

export class EventObservable {
  
  private readonly _core: StructureObservable = new StructureObservable();
  
  public readonly type: string;
  
  public emit = (data: any = null, originalEvent: any = this.type) => PIPE(
    () => this._core.setValue(<IEvent> {
      [COMMON.TYPE]: this.type,
      [COMMON.TIMESTAMP]: new Date().getTime(),
      [COMMON.ORIGIN]: originalEvent,
      [COMMON.DATA]: data
    }),
    () => this._core.resetValue()
  );
  
  public subscribe = (fn: any = DO_NOTHING): AbstractSubscription => this._core.subscribe(
    val => !this._core.isEmpty && AS_FUNCTION(fn, <IEvent> val)
  );
  
  constructor (type: string = EVENTS.ON_CLICK) {
    this.type = type
  }
  
}

