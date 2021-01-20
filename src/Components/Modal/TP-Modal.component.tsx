import React from 'react';
import {inject, observer} from 'mobx-react';
import {AbstractComponent} from '../../Core/Abstract/Abstract.component';
import {STATES, SYMBOLS} from '../../Core/Core.constants';
import {BooleanObservable} from '../../Core/Observables/Boolean.observables';
import {AWAIT, PIPE} from '../../Core/Core.helpers';
import './TP-Modal.scss';

const
  ROOT = `tp-modal`,
  CONTENT = `${ROOT}-content`;

@observer
export default class TP_Modal extends AbstractComponent {

  private readonly _show: BooleanObservable = new BooleanObservable();

  private readonly _root: any = React.createRef();

  componentDidMount() {
    const
      model: BooleanObservable = this.model;

    const
      root = this._root.current as HTMLElement,
      content = root.querySelector(`.${CONTENT}`) as HTMLElement;

    const
      openModal = () => PIPE(
        () => this._show.setValue(true),
        () => root.classList.add(STATES.IS_OPENED),
        () => AWAIT(100),
        () => content.classList.add(STATES.IS_OPENED)
      ),

      closeModal = () => PIPE(
        () => content.classList.remove(STATES.IS_OPENED),
        () => AWAIT(100),
        () => root.classList.remove(STATES.IS_OPENED),
        () => AWAIT(200),
        () => this._show.setValue(false)
      );

    this.registerSubscriptions(
      model.subscribe(
        state => state ? openModal() : closeModal()
      )
    );
  }

  render () {
    const
      {_show, _root, props} = this,
      {className, children} = props;

    return <div className={`${ROOT} ${_show.value ? STATES.IS_ACTIVE : SYMBOLS.EMPTY_STRING }`} ref={_root}>
      <div className={`${CONTENT} ${className || SYMBOLS.EMPTY_STRING}`}>
        {children || SYMBOLS.EMPTY_STRING}
      </div>
    </div>;
  }

}
