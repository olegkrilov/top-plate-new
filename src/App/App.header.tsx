import {AbstractComponent} from '../Core/Abstract/Abstract.component';
import {inject, observer} from 'mobx-react';
import {ROUTES, SERVICES} from '../Common/Constants.enum';
import {RoutingService} from '../Services/Routing.service';

const
  ROOT = `tp-header`,
  LOGO = `${ROOT}-logo`,
  NAV = `${ROOT}-nav`;

@inject(SERVICES.ROUTING_SERVICE)
@observer
export class AppHeader extends AbstractComponent {
  
  render () {
    const
      routingService: RoutingService = this.services[SERVICES.ROUTING_SERVICE];
    
    return <div className={`${ROOT}`}>
      <header className={`container`}>
        <div className={`row`}>
          <div className={`col-4`}>
            <div className={`${LOGO}`} onClick={() => routingService.goTo(ROUTES.HOME)}/>
          </div>
          <div className={`col-8`}>
            <div className={`${NAV} d-flex justify-content-end align-items-center`}>
            
            
            </div>
          </div>
        </div>
      </header>
    </div>;
  }
}

