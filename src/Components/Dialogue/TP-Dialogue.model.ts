import {COMMON, STATES, SYMBOLS} from '../../Core/Core.constants';
import {BooleanObservable} from '../../Core/Observables/Boolean.observables';
import {StructureObservable} from '../../Core/Observables/Structure.observable';
import {computed} from 'mobx';
import {DIG_OUT} from '../../Core/Core.helpers';

export default class TP_DialogueModel {

  private readonly core: StructureObservable = new StructureObservable({
    [COMMON.VIEW]: SYMBOLS.EMPTY_STRING,
    [COMMON.ERROR]: null
  });

  public readonly [STATES.IS_OPENED]: BooleanObservable = new BooleanObservable();

  public setView = (view: any, error: any = null) => {
    this.core.setValue({
      [COMMON.VIEW]: view,
      [COMMON.ERROR]: error
    });

    return this;
  };

  public show = () => {
    this[STATES.IS_OPENED].setValue(true);
    return this;
  };

  public hide = () => {
    this[STATES.IS_OPENED].setValue(false);
    return this;
  };

  @computed
  public get view () {
    return DIG_OUT(this.core, COMMON.VALUE, COMMON.VIEW);
  }

  @computed
  public get error () {
    return DIG_OUT(this.core, COMMON.VALUE, COMMON.ERROR);
  }

}

