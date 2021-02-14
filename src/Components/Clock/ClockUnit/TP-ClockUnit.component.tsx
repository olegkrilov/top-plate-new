import React from 'react';
import {AbstractComponent} from '../../../Core/Abstract/Abstract.component';
import {COMMON, STATES, SYMBOLS} from '../../../Core/Core.constants';
import TP_ClockUnitModel, {IClockUnitEventData, SWITCH_UP} from './TP-ClockUnit.model';
import './TP-ClockUnit.scss';
import {observer} from 'mobx-react';
import {NumberObservable} from '../../../Core/Observables/Number.observable';
import {IEvent} from '../../../Core/Observables/Event.observable';
import {StructureObservable} from '../../../Core/Observables/Structure.observable';
import {AbstractPipe} from '../../../Core/Abstract/Abstract.pipe';
import {AWAIT, DIG_OUT} from '../../../Core/Core.helpers';

const
  ROOT = `tp-clock-unit`,
  MASTER_PANEL = `${ROOT}-master-panel`,
  SLAVE_STATIC_PANEL = `${ROOT}-static-panel`,
  SLAVE_DYNAMIC_PANEL = `${ROOT}-dynamic-panel`,
  SLAVE_PANEL_CONTENT = `${ROOT}-content`;

const
  {IS_OPENED} = STATES,
  {VALUE, DIRECTION, DATA} = COMMON,
  WITH_ANIMATION = 'withAnimation',
  STUCK_BOTTOM = 'stuckBottom';

@observer
export default class TP_ClockUnit extends AbstractComponent {

  private readonly mainPanelValue: NumberObservable = new NumberObservable(
    (this.model as TP_ClockUnitModel).current.value
  );

  private readonly staticPanelValue: NumberObservable = new NumberObservable(
    this.mainPanelValue.value
  );

  private readonly dynamicPanelValue: NumberObservable = new NumberObservable(
    this.mainPanelValue.value
  );

  private ref: any = React.createRef();

  render () {
    const
      {className} = this.props;

    return <div className={`${ROOT} mx-1 ${className || SYMBOLS.EMPTY_STRING}`} ref={this.ref}>
      <div className={MASTER_PANEL}>
        <b>{this.mainPanelValue.value}</b>
      </div>
      {
        [SLAVE_STATIC_PANEL, SLAVE_DYNAMIC_PANEL].map((d: string, i: number) =>
          <div className={`${d}`} key={i}>
            <div className={SLAVE_PANEL_CONTENT}>
              <b>{i ? this.dynamicPanelValue.value : this.staticPanelValue.value}</b>
            </div>
          </div>
        )
      }
    </div>;
  }

  componentDidMount() {
    let
      nextValue = 0;

    const
      model: TP_ClockUnitModel = this.model;

    const
      staticPanelView = this.ref.current.querySelector(`.${SLAVE_STATIC_PANEL}`),
      dynamicPanelView = this.ref.current.querySelector(`.${SLAVE_DYNAMIC_PANEL}`);

    const
      switchUpPipe = new AbstractPipe([
        () => {
          dynamicPanelView.classList.remove(WITH_ANIMATION);
          dynamicPanelView.classList.remove(STUCK_BOTTOM);
          dynamicPanelView.classList.add(IS_OPENED);
          staticPanelView.classList.add(STUCK_BOTTOM);
          staticPanelView.classList.add(IS_OPENED);
          this.mainPanelValue.setValue(nextValue);
        },
        () => dynamicPanelView.classList.add(WITH_ANIMATION),
        () => AWAIT(150),
        () => dynamicPanelView.classList.add(STUCK_BOTTOM),
        () => this.dynamicPanelValue.setValue(this.mainPanelValue.value),
        () => AWAIT(150),
        () => {
          dynamicPanelView.classList.remove(WITH_ANIMATION);
          dynamicPanelView.classList.remove(STUCK_BOTTOM);
          dynamicPanelView.classList.remove(IS_OPENED);
          staticPanelView.classList.remove(IS_OPENED);
        },
        () => this.staticPanelValue.setValue(this.mainPanelValue.value)
  ], false);

    const switchValue = (val: number, direction: string = SWITCH_UP) => {
      if (this.mainPanelValue.value !== val) {
        nextValue = val;
        switchUpPipe.run();
      }
    };

    this.registerSubscriptions(
      model.onChange.subscribe(
        (event: IEvent) => switchValue(event[COMMON.DATA].value)
      )
    );

    this.registerPipes(
      switchUpPipe
    );

  }

}

