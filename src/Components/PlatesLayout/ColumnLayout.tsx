import React from 'react';
import {AbstractComponent} from '../../Core/Abstract/Abstract.component';
import {inject, observer} from 'mobx-react';
import {SERVICES} from '../../Common/Constants.enum';
import {AbstractPipe} from '../../Core/Abstract/Abstract.pipe';
import {APIService} from '../../Services/API.service';
import TP_Loader from '../Loader/TP-Loader.component';
import TP_ButtonModel from '../Forms/Button/TP_Button.model';
import {COMMON, EVENTS} from '../../Core/Core.constants';
import {BooleanObservable} from '../../Core/Observables/Boolean.observables';
import {API_PROPS, CONTENT_API, DEV_API} from '../../Common/API.enum';
import {AWAIT, DIG_OUT} from '../../Core/Core.helpers';
import TP_Button from '../Forms/Button/TP_Button.component';
import {SharedService} from '../../Services/Shared.service';
import {CollectionObservable} from '../../Core/Observables/Collection.observable';
import {TP_BackgroundImage} from '../TP_BackgroundImage/TP_BackgroundImage';
import {FiMapPin} from "react-icons/fi";
import {BsReply} from "react-icons/bs";
import {BsCardText} from "react-icons/bs";
import {RoutingService} from "../../Services/Routing.service";
import {ROUTES} from "../../Common/Constants.enum";
import {TEST_VALID} from "./TESTVALID";
import { BiLike } from "react-icons/bi";
import "./ColumnLayout.scss"


const
  ROOT_COLUMN = `tp-home-route-column`,
  BLOKS_COLUMN = `bloks-column`,
  BLOKS_HEADER_COLUMN = `block-header-column`,
  VIDEO_COLUMN = `video-column`,
  PROFILE_PIC_COLUMN = `profile-pic-column`,
  PROFILE_CONTAINER_COLUMN = `profile-container-column`,
  INNER_CONTAINER_COLUMN = `inner-container-column`,
  USER_NAME_COLUMN = `user-name-column`,
  COMMENTS_COLUMN = `comments-column`,
  REPLY_COLUMN = `reply-column`,
  GEO_LOCATION_COLUMN = `geo-location-column`,
  OVERLAY_COLUMN = `overlay-column`,
  LIKE_COLUMN = `like-column`,
  AD_COLUMN = `ad-something`,
  LIKE_NUMBER_COLUMN = `like-number-column`,
  LIKE_ICON_COLUMN = `like-icon-column`,
  TEXT_COLUMN = `text-column`;
  

  const 
  adPicture = `./orange.png`;

  @inject(SERVICES.API_SERVICE, SERVICES.ROUTING_SERVICE, SERVICES.SHARED_SERVICE)
@observer
export default class ColumnLayout extends AbstractComponent {

  

  private plateBloks = TEST_VALID => TEST_VALID.PLATES.map((d, i) =>
    <div className={`padding-10`} key={i}>
        <div className={`${BLOKS_COLUMN}`}>
          <div className={`${VIDEO_COLUMN} padding-bottom-10`} >
            <TP_BackgroundImage source={d.video}/> 
            <div className={`${OVERLAY_COLUMN} padding-bottom-10`}>
              <div className={`${LIKE_COLUMN}`}>
                  <div className={`${LIKE_NUMBER_COLUMN}`}>
                    {d.likes.length}
                  </div>
                  <BiLike className={`${LIKE_ICON_COLUMN}`}/>
              </div>
            </div>          
          </div>       
          <b className={`${BLOKS_HEADER_COLUMN}`}>{d.name}</b>  
            <div className={`${PROFILE_CONTAINER_COLUMN} padding-top-10`}>
              <div className={`${PROFILE_PIC_COLUMN}`}>
                <TP_BackgroundImage source={d.author.image}/>   
              </div>  
              <div className={`${INNER_CONTAINER_COLUMN}`}>
                <span className={`padding-left-10`}>{d.author.name}</span>  
                <span className={`${GEO_LOCATION_COLUMN} padding-left-10`}> <FiMapPin className={`brand-green`}/> {d.geo}</span>
              </div>  
              <div className={`${COMMENTS_COLUMN} padding-left-50`}>
                <BsCardText/>
              </div>  
              <div className={`${REPLY_COLUMN} padding-left-50`}>
                <BsReply/>
              </div>
            </div>           
        </div>
    </div>
  );

  render () {   
    return <div className={`${ROOT_COLUMN} tp-route`}>
      
      <div className={`container`}>
        <div className={`row`}>
          <div className={`col-12 col-lg-2 col-xl-2`}>       
          </div>
          <div className={`col-12 col-lg-6 col-xl-6`}>
          {this.plateBloks(TEST_VALID)}       
          </div>
          <div className={`col-12 col-lg-3 col-xl-3`}>     
            <div className={`${AD_COLUMN} padding-top-10`}>
              <TP_BackgroundImage source={adPicture}/>
            </div>  
          </div>
        </div>
      </div>
    </div>;
  }

  componentDidMount() {}

}