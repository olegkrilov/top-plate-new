import {Route, RouterStore, startRouter} from 'mobx-router';
import {CollectionObservable} from '../Core/Observables/Collection.observable';
import {COLLECTION_CONFIG_PROPS, COMMON} from '../Core/Core.constants';
import {computed} from 'mobx';
import {DIG_OUT} from '../Core/Core.helpers';
import {AbstractObserver} from '../Core/Abstract/Abstract.observer';
import {ROUTING_PROPS} from '../Common/Constants.enum';

export class RoutingService {
  
  public router: RouterStore<RoutingService> = new RouterStore<RoutingService>(this);
  
  public routes: CollectionObservable = new CollectionObservable({
    [COLLECTION_CONFIG_PROPS.TRACK_BY]: COMMON.NAME
  });
  
  public init = (routes) => {
    this.routes.replaceItems(routes.map(route => {
      route[ROUTING_PROPS.ROUTE] = new Route({
        path: `/${route[ROUTING_PROPS.PATH]}`,
        component: route[ROUTING_PROPS.COMPONENT],
        title: route[COMMON.NAME]
      });
      return route;
    }));
  
    new AbstractObserver(() => this.currentRoute).subscribe(
      val => this.routes.selectItem(DIG_OUT(val, COMMON.TITLE))
    );
  
    this.routes.subscribe(
      selectedRoute => DIG_OUT(selectedRoute, COMMON.NAME) !== DIG_OUT(this.currentRoute, COMMON.TITLE) &&
        this.router.goTo(DIG_OUT(selectedRoute, ROUTING_PROPS.ROUTE))
    );
    
    startRouter(
      this.routes.items.reduce(
        (r, d) => Object.assign(r, {[d[COMMON.NAME]]: d[ROUTING_PROPS.ROUTE]})
      ), this, {html5history: true}
    );
    
    return this;
  };
  
  public goTo = (routeName, params: any = {}) => {
    const
      route = DIG_OUT(this.routes.getItem(routeName), ROUTING_PROPS.ROUTE);
    
    route && this.router.goTo(route, params);
    
    return this;
  };
  
  @computed
  public get currentParams () {
    return this.router.params;
  }
  
  @computed
  public get currentRoute () {
    return this.router.currentRoute;
  }
  
}

export default new RoutingService();
