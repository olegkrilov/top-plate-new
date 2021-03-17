import {CollectionObservable} from '../../Core/Observables/Collection.observable';
import {COLLECTION_CONFIG_PROPS, COMMON, EVENTS, STATES} from '../../Core/Core.constants';
import {BooleanObservable} from '../../Core/Observables/Boolean.observables';
import {computed} from 'mobx';
import TP_FormInputModel from './TP-FormInput.model';
import TP_StringInputModel from './StringInput/TP-StringInput.model';
import {AS_ARRAY, IS_STRING} from '../../Core/Core.helpers';
import {EventObservable} from '../../Core/Observables/Event.observable';
import { TP_FileInputModel } from './FileInput/TP-FileInput.model';

export default class TP_FormModel {
  
  public readonly fields: CollectionObservable = new CollectionObservable(
    {[COLLECTION_CONFIG_PROPS.TRACK_BY]: COMMON.NAME}
  );

  public readonly [EVENTS.ON_SUBMIT]: EventObservable = new EventObservable(EVENTS.ON_SUBMIT);
  
  public getField = (name: string): TP_FormInputModel | TP_StringInputModel => this.fields.getItem(name);
  
  public addFields = (d): TP_FormModel => {
    this.fields.addItems(AS_ARRAY(d).reduce((fields, dd) => {
      if (IS_STRING(dd)) fields.push(new TP_StringInputModel(dd));
      else if (dd instanceof TP_StringInputModel || dd instanceof TP_FormInputModel) fields.push(dd);
      else if (dd instanceof TP_FileInputModel) {fields.push(dd)
      console.log(dd);}
      return fields;
      
    }, []));
    console.log(this.fields.items)
    return this;
  };
  
  public focusOnField = (fieldName): TP_FormModel => {
    this.fields.selectItem(fieldName);
    return this;
  };

  public reset = (): TP_FormModel => {
    this.fields.items.forEach(field => field.reset());
    return this;
  }

  public toggleDisabled = (state: boolean = true): TP_FormModel => {
    this.fields.items.forEach(field => field.toggleState(STATES.IS_DISABLED, state));
    return this;
  };

  @computed
  public get current (): any {
    return this.fields.items.reduce((formData, field: TP_FormInputModel | TP_StringInputModel) =>
      Object.assign(formData, {[field[COMMON.NAME]]: field.current}), {}
    );
  }
}
