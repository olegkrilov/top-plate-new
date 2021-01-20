import React from 'react';
import {AbstractComponent} from '../../Core/Abstract/Abstract.component';
import {observer} from 'mobx-react';
import TP_Modal from '../Modal/TP-Modal.component';
import TP_DialogueModel from './TP-Dialogue.model';
import {STATES, SYMBOLS} from '../../Core/Core.constants';
import {MdClose, MdWarning} from 'react-icons/all';
import './TP-Dialogue.scss';

const
  ROOT = `tp-dialogue-modal`,
  CONTAINER = `${ROOT}-container`,
  CLOSE_BTN = `${ROOT}-close-btn`,
  CONTENT = `${ROOT}-content`,
  ERROR_ICON = `${ROOT}-error`,
  MESSAGE_FRAME = `${ROOT}-message-frame`,
  SUBSTRATE = `${ROOT}-substrate`;

@observer
export default class TP_Dialogue extends AbstractComponent {

  render () {
    const
      {className, children} = this.props,
      model: TP_DialogueModel = this.model;

    const
      closeModal = () => model[STATES.IS_OPENED].setValue(false);

    return <TP_Modal className={`${ROOT} 
      ${className || SYMBOLS.EMPTY_STRING} 
      ${model.error ? STATES.HAS_ERROR : SYMBOLS.EMPTY_STRING}`
    } model={model[STATES.IS_OPENED]}>
      <div className={`${CONTAINER} container`}>
        <div className={`${SUBSTRATE}`} onClick={() => closeModal()}/>
        <div className={`row`}>
          <div className={`col-3 hidden-md-down`} />
          <div className={`col-12 col-xl-6 col-lg-6`}>
            <div className={`${CONTENT} p-4`}>
              <div className={ERROR_ICON}>
                <MdWarning className={`h1`}/>
                <span>{model.error}</span>
              </div>
              <div className={MESSAGE_FRAME}>
                {model.view || SYMBOLS.EMPTY_STRING}
              </div>
              <MdClose className={`${CLOSE_BTN}`} onClick={() => closeModal()}/>
            </div>
          </div>
        </div>
      </div>
    </TP_Modal>;
  }
}
