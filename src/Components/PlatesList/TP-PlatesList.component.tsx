import React from 'react';
import {AbstractComponent} from '../../Core/Abstract/Abstract.component';
import {TP_PlatesListModel} from './TP-PlatesList.model';
import {AbstractObserver} from '../../Core/Abstract/Abstract.observer';

const
  ROOT = `tp-plates-list`;

export default class TP_PlatesList extends AbstractComponent {
  
  componentDidMount() {
    const
      model = this.model as TP_PlatesListModel;
    
    
    
    // this.registerSubscriptions(
    //   new AbstractObserver(() => {}).subscribe(
    //     _ => {
    //
    //
    //
    //     }
    //
    //   )
    //
    //
    // );
    
    
    
  }
  
  render () {
    return <div className={`${ROOT}`}>
      <h1>PlATES LIST</h1>
    </div>;
  }
  
}
