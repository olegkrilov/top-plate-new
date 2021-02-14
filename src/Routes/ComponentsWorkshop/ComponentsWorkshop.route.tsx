import React from 'react';
import {AbstractComponent} from '../../Core/Abstract/Abstract.component';
import {observer} from 'mobx-react';
import TP_Clock from '../../Components/Clock/TP-Clock.component';
import TP_ClockModel from '../../Components/Clock/TP-Clock.model';
import TP_Loader from '../../Components/Loader/TP-Loader.component';
import './ComponentsWorkshop.scss';

const
  ROOT = `components-workshop`,
  CLOCK_EXAMPLE = 'clock-example';

@observer
export default class ComponentsWorkshopRoute extends AbstractComponent {

  private readonly clock: TP_ClockModel = new TP_ClockModel();

  render () {
    return <div className={ROOT}>
      <div className={`container`}>
        <div className={`row`}>
          <h1 className={`col-12 text-center`}>
            Components workshop
          </h1>
          <div className={`col-12 p-3 text-center`}>
            <TP_Clock className={CLOCK_EXAMPLE} model={this.clock} />
          </div>
        </div>
      </div>
    </div>;
  }

}
