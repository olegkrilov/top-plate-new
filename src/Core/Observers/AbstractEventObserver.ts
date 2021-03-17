import {StructureObservable} from '../Observables/Structure.observable';

export interface IAbstractEvent {
  type: string;
  timestamp: number;
  originalEvent: any;
  data: any;
}

export class AbstractEventObserver {

  private readonly _core: StructureObservable = new StructureObservable();

  public readonly type: string;

  public next (event: any, data: any = null) {
    this._core.setValue({
      type: this.type,
      timestamp: new Date().getTime(),
      originalEvent: event,
      data
    } as IAbstractEvent);
  }

  public getSubscription (callback: any, skipFirstCall: boolean = false) {
    return this._core.subscribe(() => {
      if (!this._core.isEmpty) {
        callback(this._core.value);
        this._core.resetValue();
      }
    }, skipFirstCall);
  }

  public subscribeOnNext (callback: any) {
    let subscription = this.getSubscription(
      () => {
        callback(this._core.value);
        subscription && subscription.unsubscribe();
      }
    );
    return subscription;
  }

  constructor (eventType: string = 'click') {
    this.type = eventType;
  }
}