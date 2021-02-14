import React from 'react';
import {AbstractComponent} from '../../Core/Abstract/Abstract.component';
import {COMMON, SYMBOLS} from '../../Core/Core.constants';
import TP_ClockModel from './TP-Clock.model';
import TP_ClockUnit from './ClockUnit/TP-ClockUnit.component';
import {observer} from 'mobx-react';
import {CollectionObservable} from '../../Core/Observables/Collection.observable';
import TP_ClockUnitModel from './ClockUnit/TP-ClockUnit.model';
import './TP-Clock.scss';

const
  ROOT = `tp-clock`;

const
  {NAME, VALUE, MODEL} = COMMON;

enum DATE_TIME_ITEMS {
  SECOND = 'second',
  SECONDS = 'seconds',
  MINUTE = 'minute',
  MINUTES = 'minutes',
  HOUR = 'hour',
  HOURS = 'hours',
  DAY = 'day'
}

interface ITP_ClockNamedUnit {
  [NAME]: string,
  [MODEL]: TP_ClockUnitModel,
  [VALUE] (ts: number): number
}

@observer
export default class TP_Clock extends AbstractComponent {

  private readonly views: CollectionObservable = new CollectionObservable({
    trackBy: NAME
  }).addItems([
    {
      [NAME]: DATE_TIME_ITEMS.DAY,
      [VALUE]: ts => Math.floor((ts / (1000 * 60 * 60 * 24)) % 7),
      [MODEL]: new TP_ClockUnitModel()
    },
    {
      [NAME]: DATE_TIME_ITEMS.HOURS,
      [VALUE]: ts => Math.floor(((ts / (1000 * 60 * 60)) % 24) / 10),
      [MODEL]: new TP_ClockUnitModel()
    },
    {
      [NAME]: DATE_TIME_ITEMS.HOUR,
      [VALUE]: ts => Math.floor(((ts / (1000 * 60 * 60)) % 24) % 10),
      [MODEL]: new TP_ClockUnitModel()
    },
    {
      [NAME]: DATE_TIME_ITEMS.MINUTES,
      [VALUE]: ts => Math.floor(((ts / (1000 * 60)) % 60) / 10),
      [MODEL]: new TP_ClockUnitModel()
    },
    {
      [NAME]: DATE_TIME_ITEMS.MINUTE,
      [VALUE]: ts => Math.floor((ts / (1000 * 60)) % 10),
      [MODEL]: new TP_ClockUnitModel()
    },
    {
      [NAME]: DATE_TIME_ITEMS.SECONDS,
      [VALUE]: ts => Math.floor(((ts / 1000) % 60) / 10),
      [MODEL]: new TP_ClockUnitModel()
    },
    {
      [NAME]: DATE_TIME_ITEMS.SECOND,
      [VALUE]: ts => Math.floor((ts / 1000) % 10),
      [MODEL]: new TP_ClockUnitModel()
    }
  ]);

  render () {
    const
      {props, views} = this,
      {className} = props;

    return <div className={`${ROOT} ${className || SYMBOLS.EMPTY_STRING}`}>
      <TP_ClockUnit model={views.getItem(DATE_TIME_ITEMS.DAY)[MODEL]} />
      <span className={'mx-3'}>DAYS</span>
      <TP_ClockUnit model={views.getItem(DATE_TIME_ITEMS.HOURS)[MODEL]} />
      <TP_ClockUnit model={views.getItem(DATE_TIME_ITEMS.HOUR)[MODEL]} />
      <span>&nbsp;:&nbsp;</span>
      <TP_ClockUnit model={views.getItem(DATE_TIME_ITEMS.MINUTES)[MODEL]} />
      <TP_ClockUnit model={views.getItem(DATE_TIME_ITEMS.MINUTE)[MODEL]} />
      <span>&nbsp;:&nbsp;</span>
      <TP_ClockUnit model={views.getItem(DATE_TIME_ITEMS.SECONDS)[MODEL]} />
      <TP_ClockUnit model={views.getItem(DATE_TIME_ITEMS.SECOND)[MODEL]} />
    </div>;
  }

  componentDidMount() {
    const
      {views} = this,
      model: TP_ClockModel = this.model;

    this.registerSubscriptions(
      model.date.subscribe(
        date => views.items.forEach((d: ITP_ClockNamedUnit) => d[MODEL].turnForward(d[VALUE](date)))
      )
    );
  }
}

