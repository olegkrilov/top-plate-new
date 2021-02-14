import TP_ClockUnitModel from './ClockUnit/TP-ClockUnit.model';
import {CollectionObservable} from '../../Core/Observables/Collection.observable';
import {COMMON} from '../../Core/Core.constants';
import {NumberObservable} from '../../Core/Observables/Number.observable';
import moment from 'moment';

const
  DEFAULT_FORMAT = 'HH : mm : ss';

export default class TP_ClockModel {

  public readonly date: NumberObservable = new NumberObservable();

  public setDate = (newDate) => this.date.setValue(moment(newDate).valueOf());

  constructor() {
    const
      endDate = moment().add(1, 'week').valueOf();

    setInterval(
      () => this.date.setValue(endDate - moment().valueOf()),
      1000
    );

  }

}

