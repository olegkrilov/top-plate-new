import {AbstractComponent} from '../Core/Abstract/Abstract.component';
import {inject, observer} from 'mobx-react';
import {SERVICES} from '../Common/Constants.enum';

@inject(SERVICES.ROUTING_SERVICE)
@observer
export default class AppSignIn extends AbstractComponent {


}

