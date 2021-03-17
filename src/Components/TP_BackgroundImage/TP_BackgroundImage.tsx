import * as d3 from 'd3';
import React from "react";
import {AbstractComponent} from "../../Core/Abstract/Abstract.component";
import {EMPTY_STRING} from "../../Core/Constants/ViewClasses.cnst";
import {StringObservable} from "../../Core/Observables/String.observable";
import {BACKGROUND_IMAGE} from "../../Core/Constants/PropertiesAndAttributes.cnst";
import {inject, observer} from "mobx-react";
import {SharedService} from "../../Services/Shared.service";
import "./TP_BackgroundImage.scss";

const
  ROOT = `tp-background-image`,
  CUSTOM_CONTENT = `${ROOT}-custom-content`;

@inject('sharedService')
@observer
export class TP_BackgroundImage extends AbstractComponent {

  private sharedService: SharedService;

  protected readonly model: StringObservable;

  private root: any = React.createRef();

  componentDidMount(): void {
    const
      {model, sharedService, root} = this,
      img = d3.select(root.current);

    this.registerSubscriptions(
      model.subscribe(() => {
        let source = model.value;
        source ? sharedService.loadImages(source)
          .then(() => img.style(BACKGROUND_IMAGE, () => `url(${source || EMPTY_STRING})`)) :
          img.style(BACKGROUND_IMAGE, () => `url(${null})`);
      })
    );
  }

  render () {
    const
      {props, root} = this,
      {children, className} = props;

    return <div className={`${ROOT} pos-rel size-cover ${className || EMPTY_STRING}`} ref={root}>
      {children && <div className={`${CUSTOM_CONTENT} pos-abs top-0 left-0 size-cover`}>{children}</div>}
    </div>;
  }

  constructor (props) {
    super(props);
    this.model = props.model instanceof StringObservable ? props.model : new StringObservable(props.source);
    this.sharedService = props.sharedService;
  }

}