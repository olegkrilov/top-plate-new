import {AbstractComponent} from '../../Core/Abstract/Abstract.component';
import {inject, observer} from 'mobx-react';
import {ROUTES, SERVICES} from '../../Common/Constants.enum';
import {RoutingService} from '../../Services/Routing.service';
import {DIG_OUT} from '../../Core/Core.helpers';

@inject(SERVICES.ROUTING_SERVICE)
@observer
export default class RedirectRoute extends AbstractComponent {
  
  componentDidMount() {
    return (this.services[SERVICES.ROUTING_SERVICE] as RoutingService).goTo(
      DIG_OUT(this.props, 'redirectTo') || ROUTES.HOME
    )
  }
  
}