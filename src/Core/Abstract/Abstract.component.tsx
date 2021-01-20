import React from 'react';
import {AbstractSubscription} from './Abstract.subscription';
import {AbstractPipe} from './Abstract.pipe';
import {COMMON} from '../Core.constants';

export class AbstractComponent extends React.Component<any, any> {
  
  protected readonly model: any = null;
  
  protected readonly subscriptions: AbstractSubscription[] = [];
  
  protected readonly pipes: AbstractPipe[] = [];
  
  protected readonly services: any = {};
  
  protected registerSubscriptions = (...subscriptions): this => {
    Array.from(subscriptions).forEach(s => s instanceof AbstractSubscription && this.subscriptions.push(s));
    return this;
  };
  
  protected clearSubscriptions = (): this => {
    this.subscriptions.forEach(s => s && s.unsubscribe());
    this.subscriptions.length = 0;
    return this;
  };
  
  protected registerPipes = (...pipes): this => {
    Array.from(pipes).forEach(p => p instanceof AbstractPipe && this.pipes.push(p));
    return this;
  };
  
  protected clearPipes = (): this => {
    this.pipes.forEach(p => p && p.stop().unsubscribe());
    this.pipes.length = 0;
    return this;
  };
  
  componentWillUnmount() {
    this
      .clearPipes()
      .clearSubscriptions();
  }
  
  render(){
    return <div/>;
  }

  constructor(props) {
    super(props);
    Object.keys(props).forEach(key => /service$/i.test(key) && (this.services[key] = props[key]));
    this.model = props.model || null;
  }
}
