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
import {TEST_VALID} from "./TESTVALID";
import { BiLike } from "react-icons/bi";
import "./GridLayout.scss";



const
  ROOT_GRID = `tp-home-route-grid`,
  BLOKS_GRID = `bloks-grid`,
  BLOKS_HEADER_GRID = `block-header-grid`,
  VIDEO_GRID = `video-grid`,
  PROFILE_PIC_GRID = `profile-pic-grid`,
  PROFILE_CONTAINER_GRID = `profile-container-grid`,
  INNER_CONTAINER_GRID = `inner-container-grid`,
  USER_NAME_GRID = `user-name-grid`,
  COMMENTS_GRID = `comments-grid`,
  REPLY_GRID = `reply-grid`,
  GEO_LOCATION_GRID = `geo-location-grid`,
  OVERLAY_GRID = `overlay-grid`,
  LIKE_GRID = `like-grid`,
  LIKE_ICON_GRID = `like-icon-grid`,
  LIKE_NUMBER_GRID = `like-number-grid`,
  TEXT_GRID = `text-grid`;

  @inject(SERVICES.API_SERVICE, SERVICES.ROUTING_SERVICE, SERVICES.SHARED_SERVICE)
@observer
export default class ColomnLayout extends AbstractComponent {

  

  private plateBloks = TEST_VALID => TEST_VALID.PLATES.map((d, i) =>
    <div className={`padding-10`} key={i}>
        <div className={`${BLOKS_GRID}`}>
          <div className={`${VIDEO_GRID} padding-bottom-10`} >
            <TP_BackgroundImage source={d.video}/>
            <div className={`${OVERLAY_GRID} padding-bottom-10`}>
              <div className={`${LIKE_GRID}`}>
                  <div className={`${LIKE_NUMBER_GRID}`}>
                    {d.likes.length}
                  </div>
                  <BiLike className={`${LIKE_ICON_GRID}`}/>
              </div>
            </div>  
          </div>       
          <b className={`${BLOKS_HEADER_GRID}`}>{d.name}</b>  
            <div className={`${PROFILE_CONTAINER_GRID} padding-top-10`}>
              <div className={`${PROFILE_PIC_GRID}`}>
                <TP_BackgroundImage source={d.author.image}/>   
              </div>  
              <div className={`${INNER_CONTAINER_GRID}`}>
                <span className={`padding-left-10`}>{d.author.name}</span>  
                <span className={`${GEO_LOCATION_GRID} padding-left-10`}> <FiMapPin className={`brand-green`}/> {d.geo}</span>
              </div>  
              <div className={`${COMMENTS_GRID} padding-left-50`}>
                <BsCardText/>
              </div>  
              <div className={`${REPLY_GRID} padding-left-50`}>
                <BsReply/>
              </div>
            </div>           
        </div>
    </div>
  );

  render () {   
    return <div className={`${ROOT_GRID} tp-route`}>
        <div className={`container-fluid`}>     
              <div className={`row`}>
                {this.plateBloks(TEST_VALID)}
              </div>   
        </div>
     
    </div>;
  }

  componentDidMount() {}

}