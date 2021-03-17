import {BooleanObservable} from '../../Core/Observables/Boolean.observables';
import {EventObservable} from '../../Core/Observables/Event.observable';
import {COMMON, EVENTS, STATES, SYMBOLS} from '../../Core/Core.constants';
import {AS_FUNCTION, DO_NOTHING, RUN_SAFELY} from '../../Core/Core.helpers';
import {computed} from 'mobx';

export default class TP_FormInputModel {
  
  public readonly [COMMON.NAME]: string;
  
  public readonly [STATES.IS_REQUIRED]: BooleanObservable = new BooleanObservable(); 
  
  public readonly [STATES.IS_FOCUSED]: BooleanObservable = new BooleanObservable();
  
  public readonly [STATES.IS_DISABLED]: BooleanObservable = new BooleanObservable();
  
  public readonly [EVENTS.ON_CHANGE]: EventObservable = new EventObservable(EVENTS.ON_CHANGE);

  public readonly [EVENTS.ON_FOCUS]: EventObservable = new EventObservable(EVENTS.ON_FOCUS);

  public readonly [EVENTS.ON_BLUR]: EventObservable = new EventObservable(EVENTS.ON_BLUR);

  public readonly [EVENTS.ON_ERROR]: EventObservable = new EventObservable(EVENTS.ON_ERROR);
  
  public toggleState = (stateName: string = STATES.IS_FOCUSED, stateValue: boolean | null = null) => {
    RUN_SAFELY((this[stateName] as BooleanObservable).toggleValue(stateValue));
    return this;
  };

  public reset = (): any => this;

  @computed
  public get current (): any {
    // console.log(this.core);
    console.log(this);
    return SYMBOLS.EMPTY_STRING;
  }
  
  constructor(fieldName: string) {
    this[COMMON.NAME] = fieldName;
  }
  
}

