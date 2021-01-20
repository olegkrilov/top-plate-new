import React from 'react';
import {AbstractComponent} from '../../Core/Abstract/Abstract.component';
import {SYMBOLS} from '../../Core/Core.constants';
import './TP-Loader.scss'

const
  ROOT = `tp-loader`,
  ITEM = `${ROOT}-item`;

export default class TP_Loader extends AbstractComponent {

  render () {
    const {className} = this.props;
    
    return <div className={`${ROOT} ${className || SYMBOLS.EMPTY_STRING}`}>{
      'ABC'.split(SYMBOLS.EMPTY_STRING).map(key =>
        <div className={`${ITEM}`} key={key} />
      )
    }</div>;
  }
  
}