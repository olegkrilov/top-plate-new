import React from 'react';
import {AbstractComponent} from '../../../Core/Abstract/Abstract.component';
import {observer} from 'mobx-react';
import TP_ButtonModel from './TP_Button.model';
import {EVENTS, STATES, SYMBOLS} from '../../../Core/Core.constants';
import {AS_FUNCTION, AWAIT, DIG_OUT, IS_FUNCTION, IS_NOT_NULL, PIPE} from '../../../Core/Core.helpers';
import './TP_Button.scss';

const
  ROOT = `tp-button`,
  DECORATION = `${ROOT}-decoration`;

const
  WAS_CLICKED = 'wasCLicked',
  WITH_ANIMATION = 'withAnimation';

@observer
export default class TP_Button extends AbstractComponent {

  private readonly _model: TP_ButtonModel;

  private readonly _root: any = React.createRef();

  private _onClick = (e) => {
    if (this._model[STATES.IS_DISABLED].value) return

    const
      root: HTMLElement = this._root.current,
      decoration: HTMLElement | null = root.querySelector(`.${DECORATION}`);

    if (IS_NOT_NULL(decoration)) {
      const
        {left, top} = root.getBoundingClientRect(),
        elem = decoration as HTMLElement;

      elem.style.top = `${(DIG_OUT(e, 'clientY') || 0) - top}px`;
      elem.style.left = `${(DIG_OUT(e, 'clientX') || 0) - left}px`;
    }

    return PIPE(
      () => AWAIT(10),
      () => root.classList.add(WITH_ANIMATION),
      () => root.classList.add(WAS_CLICKED),
      () => this._model[EVENTS.ON_CLICK].emit(null, e),
      () => AWAIT(300),
      () => root.classList.remove(WITH_ANIMATION),
      () => root.classList.remove(WAS_CLICKED)
    );
  };

  render () {
    const
      {props, _model, _root} = this,
      {className, children} = props;

    const
      isDisabled = _model[STATES.IS_DISABLED].value

    return <button className={`
      ${ROOT} ${className || SYMBOLS.EMPTY_STRING} 
      ${isDisabled ? STATES.IS_DISABLED : SYMBOLS.EMPTY_STRING}`}
                   ref={_root}
                   onClick={e => this._onClick(e)}
                   disabled={isDisabled}>
      {children || SYMBOLS.EMPTY_STRING}
      <div className={`${DECORATION}`} />
    </button>;
  }

  componentDidMount() {
    const
      {props, _model} = this;

    IS_FUNCTION(props[EVENTS.ON_CLICK]) && this.registerSubscriptions(
      _model[EVENTS.ON_CLICK].subscribe(
        e => AS_FUNCTION(props[EVENTS.ON_CLICK], e)
      )
    );
  }

  constructor(props) {
    super(props);
    this._model = this.model instanceof TP_ButtonModel ? this.model : new TP_ButtonModel();
  }

}
