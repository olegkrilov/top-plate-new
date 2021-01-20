import React from 'react';
import {AbstractComponent} from '../../../Core/Abstract/Abstract.component';
import {COMMON, EVENTS, KEY_CODES, STATES, SYMBOLS, TYPES} from '../../../Core/Core.constants';
import TP_StringInputModel from './TP-StringInput.model';
import {DIG_OUT} from '../../../Core/Core.helpers';
import {computed} from 'mobx';
import './TP-StringInput.scss';
import {observer} from 'mobx-react';

const
  ROOT = `tp-string-input`,
  DECORATION = `${ROOT}-decoration`,
  CORE = `${ROOT}-core`;

const
  HAS_DECORATION = 'hasDecoration';

@observer
export default class TP_StringInput extends AbstractComponent {
  
  private _coreRef: any = React.createRef();
  
  private _changeFocus = (state, e) => {
    const
      model = this.model as TP_StringInputModel;
  
    model[STATES.IS_FOCUSED].setValue(state);
    return model[EVENTS.ON_FOCUS].emit(model[STATES.IS_FOCUSED].value, e);
  };
  
  private _onChange = (e) => {
    if (!this._valuesAreEqual) {
      const
        model: TP_StringInputModel = this.model,
        value = DIG_OUT(e, COMMON.TARGET, COMMON.VALUE);
      
      model.core.setValue(value);
      return model[EVENTS.ON_CHANGE].emit(value, e);
    }
  };
  
  private _onFocus = (e) => this._changeFocus(true, e);
  
  private _onBlur = (e) => this._changeFocus(false, e);
  
  private _onKeyDown = (e) => {
    const
      model = this.model as TP_StringInputModel,
      key = DIG_OUT(e, 'which');
    
    if (key === KEY_CODES.ENTER_KEY) return model[EVENTS.ON_SUBMIT].emit(model[COMMON.NAME], e);
  };
  
  @computed
  private get _valuesAreEqual (): boolean {
    return (this.model as TP_StringInputModel).current === DIG_OUT(this._coreRef, COMMON.CURRENT, COMMON.VALUE);
  }
  
  render () {
    const
      {props, _coreRef} = this,
      {className, type, placeholder, children} = props;
    
    const
      model = this.model as TP_StringInputModel,
      hasDecoration = !!children,
      isRequired = model[STATES.IS_REQUIRED].value,
      isFocused = model[STATES.IS_FOCUSED].value,
      isDisabled = model[STATES.IS_DISABLED].value;

    return <label className={`${ROOT}
        ${className || SYMBOLS.EMPTY_STRING}
        ${hasDecoration ? HAS_DECORATION : SYMBOLS.EMPTY_STRING}
        ${isRequired ? STATES.IS_REQUIRED : SYMBOLS.EMPTY_STRING}
        ${isFocused ? STATES.IS_FOCUSED : SYMBOLS.EMPTY_STRING}
        ${isDisabled ? STATES.IS_DISABLED : SYMBOLS.EMPTY_STRING}`}>
      <div className={DECORATION}>{children}</div>
      <input className={`${CORE}`}
             disabled={isDisabled}
             ref={_coreRef}
             name={model[COMMON.NAME] || SYMBOLS.EMPTY_STRING}
             type={type || TYPES.STRING}
             placeholder={placeholder || SYMBOLS.EMPTY_STRING}
             onChange={(e) => this._onChange(e)}
             onFocus={(e) => this._onFocus(e)}
             onBlur={(e) => this._onBlur(e)}
             onKeyDown={(e) => this._onKeyDown(e)}
      />
    </label>;
  }
  
  componentDidMount() {
    const
      model: TP_StringInputModel = this.model,
      elem: HTMLInputElement = this._coreRef[COMMON.CURRENT];
    
    const
      isFocused = () => document.activeElement === elem;
    
    this.registerSubscriptions(
      model.core.subscribe(
        value => !this._valuesAreEqual && (elem.value = value)
      ),
      model[STATES.IS_FOCUSED].subscribe(
        state => {
          state && !isFocused() && elem.focus();
          !state && isFocused() && elem.blur();
        }
      )
    );
  }
  
}