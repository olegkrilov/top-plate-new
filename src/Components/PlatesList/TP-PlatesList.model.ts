import {CollectionObservable} from '../../Core/Observables/Collection.observable';
import {COLLECTION_CONFIG_PROPS, COMMON, EVENTS, STATES} from '../../Core/Core.constants';
import {EventObservable} from '../../Core/Observables/Event.observable';
import {CONTENT_API} from '../../Common/API.enum';
import {StructureObservable} from '../../Core/Observables/Structure.observable';
import {StringObservable} from '../../Core/Observables/String.observable';
import {ENVIRONMENTS} from '../../Common/Constants.enum';
import {BooleanObservable} from '../../Core/Observables/Boolean.observables';

export class TP_PlatesListModel {
  
  public readonly items: CollectionObservable = new CollectionObservable({
    [COLLECTION_CONFIG_PROPS.TRACK_BY]:  COMMON.DB_ID
  });
  
  public readonly source: StringObservable = new StringObservable(CONTENT_API.GET_PLATES);
  
  public readonly environment: StringObservable = new StringObservable(ENVIRONMENTS.HOMEMADE);
  
  public readonly [EVENTS.ON_SCROLL]: EventObservable = new EventObservable(EVENTS.ON_SCROLL);
  
  public readonly [STATES.IS_LOADING]: BooleanObservable = new BooleanObservable(true);
  
  public readonly [STATES.IS_FINISHED]: BooleanObservable = new BooleanObservable();
  
}