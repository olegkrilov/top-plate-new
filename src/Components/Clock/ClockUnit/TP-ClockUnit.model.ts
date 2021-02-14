import {NumberObservable} from '../../../Core/Observables/Number.observable';
import {EventObservable} from '../../../Core/Observables/Event.observable';
import {COMMON, EVENTS} from '../../../Core/Core.constants';
import {DO_NOTHING, IS_NULL} from '../../../Core/Core.helpers';

export const
  SWITCH_UP = 'switchUp',
  SWITCH_DOWN = 'switchDown';

export interface IClockUnitEventData {
  [COMMON.VALUE]: number,
  [COMMON.DIRECTION]: string
}

export default class TP_ClockUnitModel {

  public readonly current: NumberObservable;

  public readonly onChange: EventObservable = new EventObservable(EVENTS.ON_CHANGE);

  private updateCurrentValue = (newValue: number, direction: string): TP_ClockUnitModel => {
    let
      value = Math.floor(newValue);

    if (value > 9) value = 0;
    if (value < 0) value = 9;

    this.onChange.emit({value, direction} as IClockUnitEventData).then(() => this.current.setValue(value));
    return this;
  };

  public turnForward = (value: number | null = null): TP_ClockUnitModel => this.updateCurrentValue(
    IS_NULL(value) ? this.current.value + 1 : value as number,
    SWITCH_UP
  );

  public turnBackward = (value: number | null = null): TP_ClockUnitModel => this.updateCurrentValue(
    IS_NULL(value) ? this.current.value - 1 : value as number,
    SWITCH_DOWN
  );

  constructor(initialValue: number = 0) {
    this.current = new NumberObservable(initialValue);
  }

}

