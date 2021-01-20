import {EVENTS, STATES} from '../../../Core/Core.constants';
import {BooleanObservable} from '../../../Core/Observables/Boolean.observables';
import {EventObservable} from '../../../Core/Observables/Event.observable';
import {RUN_SAFELY} from '../../../Core/Core.helpers';

export default class TP_ButtonModel {

  public readonly [STATES.IS_DISABLED]: BooleanObservable = new BooleanObservable();

  public readonly [EVENTS.ON_CLICK]: EventObservable = new EventObservable(EVENTS.ON_CLICK);

  public toggleDisabled = (stateValue: boolean | null = null) => {
    RUN_SAFELY((this[STATES.IS_DISABLED] as BooleanObservable).toggleValue(stateValue));
    return this;
  };

}