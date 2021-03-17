import * as d3 from "d3";
import React from "react";
import {AbstractComponent} from "../../../Core/Abstract/Abstract.component";
import {TP_FileInputModel} from "./TP-FileInput.model";
import {observer} from "mobx-react";
import {EMPTY_STRING, IS_ACTIVE, IS_DISABLED, IS_EMPTY, IS_FOCUSED} from "../../../Core/Constants/ViewClasses.cnst";
import {AS_ARRAY, DIG_OUT, PIPE} from "../../../Core/Core.helpers";
import {DATA, DATE, NAME, SIZE, TYPE} from "../../../Core/Constants/PropertiesAndAttributes.cnst";
import {IoMdClose, IoMdCloseCircle, IoMdListBox} from "react-icons/all";
import {SwitchObservable} from "../../../Core/Observables/SwitchObservable";
import "./TP-FileInput.scss";

const
  ROOT = `tp-file-input`,
  TRIGGER = `${ROOT}-trigger`,
  CORE = `${ROOT}-core`,
  FILE = `${ROOT}-file`,
  FILE_PREVIEW = `${FILE}-preview`,
  FILE_PREVIEW_LABEL = `${FILE_PREVIEW}-label`,
  FILE_PREVIEW_ICON = `${FILE_PREVIEW}-icon`,
  REMOVE_FILE_BTN = `${FILE_PREVIEW}-remove-btn`,
  DROP_ZONE = `${ROOT}-drop-zone`;
  



@observer
export class TP_FileInput extends AbstractComponent {

  public readonly model: TP_FileInputModel;

  private readonly isActive: SwitchObservable = new SwitchObservable();

  private readonly ref: any = React.createRef();

  private onChange = (event) => {
    const
      {model} = this,
      file = DIG_OUT(event, 'target', 'files', '0');

    file && PIPE(
      () => model.setFile({
        [NAME]: file[NAME],
        [DATA]: file
      }),
      () => model.onChange.emit(model.currentValue)
    )
      .catch(err => console.log(err));
  };

  private onFocus = () => this.model.isFocused.setValue(true);

  private onBlur = () => this.model.isFocused.setValue(false);

  private removeFile = d => this.model.clearFile();

  private getFilePreview = d =>
    <div className={`${FILE_PREVIEW} ew-bg-white display-flex align-center padding-10 padding-left-50 pos-rel`}>
      <div className={`${FILE_PREVIEW_ICON} pos-abs left-0 top-0 ew-block-width-0-and-half ew-block-height-0-and-half display-flex align-center`}>
        <IoMdListBox className={`font-size-40 opacity-4`}/>
      </div>
      <p className={`${FILE_PREVIEW_LABEL}`}>{d[NAME]}</p>
      <IoMdCloseCircle className={`${REMOVE_FILE_BTN} pos-abs top-0 right-0 ew-clickable`} onClick={() => this.removeFile(d)} />
    </div>;

  private onDragEnter = e => this.isActive.setValue(true);

  private onDragOver = e => {
    e.preventDefault();
  };

  private onDragLeave = e => {
    this.isActive.setValue(false);
  };

  private onDrop = e => {
    e.preventDefault();
    this.isActive.setValue(false);

    const
      file = DIG_OUT(Array.from(e.dataTransfer.files), '0');

    file && this.model.setFile({
      [NAME]: file[NAME],
      [DATA]: file
    });
  };

  render() {
    const
      {model, props, ref,} = this,
      {className, children} = props;
      
    console.log(model);
    const
      isActive = this.isActive.value,
      isFocused = model.isFocused.value,
      isDisabled = model.isDisabled.value,
      isEmpty = !model.fileName;

    return <div className={`${ROOT} 
        ${isDisabled ? IS_DISABLED : EMPTY_STRING} 
        ${isFocused ? IS_FOCUSED : EMPTY_STRING}
        ${isActive ? IS_ACTIVE : EMPTY_STRING}
        ${isEmpty ? IS_EMPTY : EMPTY_STRING}
        ${className || EMPTY_STRING} pos-rel`} ref={ref}>
      {isEmpty &&
        <label className={`${TRIGGER} size-cover display-flex align-center ew-clickable margin-0`}
               onDragEnter={e => this.onDragEnter(e)}>
        <input className={`${CORE} display-none`} type={`file`}
          onFocus={() => this.onFocus()}
          onBlur={() => this.onBlur()}
          onChange={e => this.onChange(e)} />
        {children || EMPTY_STRING}
      </label>}
      {isActive &&
        <div className={`${DROP_ZONE} pos-abs top-0 left-0 full-width full-height ew-bg-grey opacity-4`}
             onDragLeave={e => this.onDragLeave(e)}
             onDragOver={e => this.onDragOver(e)}
             onDrop={e => this.onDrop(e)}/>
      }
      {!isEmpty && AS_ARRAY(model.currentValue).map((d, i) =>
        <div className={`${FILE} padding-10 display-inline-flex`} key={i}>{this.getFilePreview(d)}</div>
      )}
    </div>
  }

  constructor(props) {
    super(props);
    this.model = props.model;
  }


}

