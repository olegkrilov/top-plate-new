import React from 'react';
import {AbstractComponent} from '../../Core/Abstract/Abstract.component';
import {inject, observer} from 'mobx-react';
import {SERVICES} from '../../Common/Constants.enum';
import {AbstractPipe} from '../../Core/Abstract/Abstract.pipe';
import {APIService} from '../../Services/API.service';
import TP_Loader from '../../Components/Loader/TP-Loader.component';
import TP_ButtonModel from '../../Components/Forms/Button/TP_Button.model';
import {COMMON, EVENTS} from '../../Core/Core.constants';
import {BooleanObservable} from '../../Core/Observables/Boolean.observables';
import {API_PROPS, CONTENT_API, DEV_API} from '../../Common/API.enum';
import {AWAIT, DIG_OUT} from '../../Core/Core.helpers';
import TP_Button from '../../Components/Forms/Button/TP_Button.component';
import {SharedService} from '../../Services/Shared.service';
import {CollectionObservable} from '../../Core/Observables/Collection.observable';
import {TP_BackgroundImage} from '../../Components/TP_BackgroundImage/TP_BackgroundImage';
import {FiMapPin} from "react-icons/fi";
import {BsReply} from "react-icons/bs";
import {BsCardText} from "react-icons/bs";
import {RoutingService} from "../../Services/Routing.service";
import {ROUTES} from "../../Common/Constants.enum";
import GridLayout from "../../Components/PlatesLayout/GridLayout";
import ColumnLayout from "../../Components/PlatesLayout/ColumnLayout";

import './Home.route.scss';


const
  ROOT = `tp-home-route`;



@inject(SERVICES.API_SERVICE, SERVICES.ROUTING_SERVICE, SERVICES.SHARED_SERVICE)
@observer
export default class HomeRoute extends AbstractComponent { 


  private readonly isLoading: BooleanObservable = new BooleanObservable();

  private readonly generateRandomDataBtn: TP_ButtonModel = new TP_ButtonModel();

  private readonly clearDataBtn: TP_ButtonModel = new TP_ButtonModel();

  private readonly plates: CollectionObservable = new CollectionObservable({
    trackBy: COMMON.DB_ID
  });

  private onTumblerClick = () => this.services.sharedService.semiColomn.toggleValue();

  private changePage = () => this.services.routingService.goTo(ROUTES.MAIN);



  render () {
    const
      {generateRandomDataBtn, clearDataBtn, isLoading, plates} = this,
      sharedService: SharedService = this.services[SERVICES.SHARED_SERVICE];
      
    
    return <div className={`${ROOT} tp-route`}>

        <TP_Button onClick={() => this.onTumblerClick()}>     
              <span>TUMBLER</span>
        </TP_Button>
        <TP_Button onClick={() => this.changePage()}>     
              <span>PAGECHANGE</span>
        </TP_Button>
        {sharedService.semiColomn.value && <div>
          <GridLayout/>
        </div>}
        {!sharedService.semiColomn.value && <div>
          <ColumnLayout/>
        </div>}
        
     
    </div>;
  }

  componentDidMount() {
    const
      {services, generateRandomDataBtn, clearDataBtn, isLoading, plates} = this,
      apiService: APIService = services.apiService,
      sharedService: SharedService = services.sharedService;

    clearDataBtn.toggleDisabled(true);

    const
      refreshViewPipe = new AbstractPipe([
        () => isLoading.setValue(true),
        () => apiService.sendGet(CONTENT_API.GET_PLATES),
        data => plates.replaceItems(data)
      ], false)
        .finally(() => isLoading.setValue(false)),

      generateItemsPipe = new AbstractPipe([
        () => isLoading.setValue(true),
        () => apiService.sendPost(DEV_API.CREATE_RANDOM_PLATES),
        () => refreshViewPipe.run()
      ], false)
        .then(res => console.log(res))
        .catch(err => sharedService.appDialogue
          .setView(DIG_OUT(err, API_PROPS.STATUS_TEXT), DIG_OUT(err, API_PROPS.STATUS))
          .show()
        );

    this.registerSubscriptions(
      generateRandomDataBtn[EVENTS.ON_CLICK].subscribe(
        () => generateItemsPipe.run()
      ),
      
      isLoading.subscribe(
        state => generateRandomDataBtn.toggleDisabled(state)
      )
    );

    this.registerPipes(refreshViewPipe.run(), generateItemsPipe);
  }

}

