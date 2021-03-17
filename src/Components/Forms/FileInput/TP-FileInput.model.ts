
import {StructureObservable} from "../../../Core/Observables/Structure.observable";
import {AbstractInput} from "../../../Core/Abstract/Abstract.input";
import {computed, observable, keys} from "mobx";
import {
  AS_ARRAY,
  CHECK_AND_CALL,
  IS_FUNCTION,
  IS_NOT_NULL,
  DIG_OUT,
  IS_NULL,
  GET_TRUE
} from "../../../Core/Core.helpers";
import {EMPTY_STRING} from "../../../Core/Constants/ViewClasses.cnst";
import {DATA, NAME, SIZE, TYPE, PLACEHOLDER} from "../../../Core/Constants/PropertiesAndAttributes.cnst";
import {ALWAYS_TRUE} from "../../../Common/Helpers/Validators";
import TP_FormInputModel from '../TP-FormInput.model';

export interface TP_FileInputValidators {
  isRequired?: any,
  isValidType?: any,
  isValidSize?: any
}

export interface TP_FileInputSettings {
  placeholder?: string,
  validators?: TP_FileInputValidators | null
  
}

export class TP_FileInputModel extends TP_FormInputModel {

  private readonly _file: StructureObservable = new StructureObservable();

  public readonly defaultValue: any;

  public readonly settings: any = {};

   

  public setFile = d => {
    const
      {onError, settings, _file} = this,
      validators: TP_FileInputValidators = settings.validators;

    console.log(d);

    if (!CHECK_AND_CALL(validators.isValidSize, d)) onError.emit('File upload error', {
      error: true,
      statusText: 'File size is too big'
    });

    else if (!CHECK_AND_CALL(validators.isValidType, d)) onError.emit('File upload error', {
      error: true,
      statusText: 'File type is not allowed'
    });

    else _file.setValue(d);

    return this;
  };

  public clearFile = () => {
    this._file.resetValue();
    return this;
  };

  public getDefaultSettings = (): TP_FileInputSettings => ({
    placeholder: EMPTY_STRING,
    
    validators: {
      isRequired: ALWAYS_TRUE(),
      isValidType: ALWAYS_TRUE(),
      isValidSize: ALWAYS_TRUE()
    }
  });

  @computed
  public get currentValue () {
    return this._file.isEmpty ? null : this._file.value;
  }

  @computed
  public get fileName () {
    return IS_NULL(this.currentValue) ? EMPTY_STRING : DIG_OUT(this.currentValue, NAME);
  }

  @computed
  public get hasChanges () {
    return `${this.fileName}`.trim() !== `${this.defaultValue}`.trim();
  }

  @computed
  public get isValid (): boolean {
    const
      {_file, settings} = this,
      {validators} = settings,
      val = _file.value.data;

    return IS_NOT_NULL(validators) ? Object.keys(validators).every(key => CHECK_AND_CALL(validators[key], val)) : true;
  }
  
  constructor (fieldName: string, customSettings: TP_FileInputSettings = {}, defaultValue: any = null) {
    
    super(fieldName);
    this.settings = this.getDefaultSettings();
    Object.keys(this.settings.validators).forEach(key => {
      let customValidator = DIG_OUT(customSettings, 'validators', key);
      this.settings.validators[key] = IS_FUNCTION(customValidator) ? customValidator : this.settings.validators[key];
    });
    if (IS_NOT_NULL(defaultValue)) {
      const
        fileName = DIG_OUT(defaultValue, NAME);

      if (fileName) {
        this.setFile({
          [NAME]: fileName,
          [DATA]: defaultValue
        });
        this.defaultValue = fileName;
      }
    }
  }
}

