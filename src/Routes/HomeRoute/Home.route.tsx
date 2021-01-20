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

  render () {
    const
      {generateRandomDataBtn, clearDataBtn, isLoading, plates} = this;
    
    return <div className={`${ROOT} tp-route`}>
      <div className={`container`}>
        <div className={`row`}>
          <div className={`col-12 text-right mt-5 mb-5`}>
            <TP_Button className={`green-btn mr-2`} model={generateRandomDataBtn}>
              <span>Generate Data</span>
            </TP_Button>
            <TP_Button className={`d-inline-block`} model={clearDataBtn}>
              <span>Clear Data</span>
            </TP_Button>
          </div>
          {isLoading.value ?
            <div className={`col-12`}><TP_Loader /></div> :
            plates.items.map((d) =>
              <div className={`col-12 p-2`} key={d[COMMON.DB_ID]}>
                <span>{d[COMMON.NAME]}</span>
              </div>
            )
          }
        </div>
      </div>
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

