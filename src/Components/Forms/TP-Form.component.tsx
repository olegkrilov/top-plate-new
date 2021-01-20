import React from 'react';
import {AbstractComponent} from '../../Core/Abstract/Abstract.component';
import {COLLECTION_METHODS, COLLECTION_PROPS, STATES, SYMBOLS} from '../../Core/Core.constants';
import TP_FormModel from './TP-Form.model';
import TP_FormInputModel from './TP-FormInput.model';
import {observer} from 'mobx-react';

const
  ROOT = `tp-form`;

@observer
export default class TP_Form extends AbstractComponent {
  
  render() {
    const
      {className, children} = this.props;
    
    return <form className={`${ROOT} ${className || SYMBOLS.EMPTY_STRING}`}
                 noValidate={true}
                 onSubmit={e => e.preventDefault()}>{children}</form>;
  }
  
  componentDidMount() {
    const
      model: TP_FormModel = this.model;
    
    this.registerSubscriptions(
      model.fields.subscribe(
        fields => fields.forEach((field: TP_FormInputModel) => this.registerSubscriptions(
          field[STATES.IS_FOCUSED].subscribe(
            state => field[COLLECTION_METHODS.TOGGLE](state)
          )
        )),
        false
      ),
      model.fields.subscribe(
        (selectedField: TP_FormInputModel | null) => selectedField && selectedField.toggleState(
          STATES.IS_FOCUSED,
          true
        )
      )
    );
  }
}

