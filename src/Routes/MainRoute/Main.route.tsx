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
import {TEST_VALID} from "./TESTVALID"
import ColumnLayout from "../../Components/PlatesLayout/ColumnLayout";
import GridLayout from "../../Components/PlatesLayout/GridLayout";
import { BiLike } from "react-icons/bi";
import {AiOutlineWarning} from "react-icons/ai";
import Moment from 'react-moment';
import "./Main.route.scss";

const
ROOT = `tp-main-route`,
AD = `ad`,
VIDEO = `video`,
PROFILE_PIC = `profile-pic`,
AUTHOR_NAME = `author-name`,
PROFILE_CONTAINER = `profile-container`,
INNER_CONTAINER = `inner-container`,
REPLY = `reply`,
GEO_LOCATION = `geo-location`,
OVERLAY = `overlay`,
LIKE = `like`,
LIKE_NUMBER = `like-number`,
LIKE_ICON = `like-icon`,
NAME_RECIPE = `name-recipe`,
NAME = `name`,
WEEK = `week`,
RECIPE = `recipe`,
RECIPE_HEADER = `recipe-header`,
RECIPE_INNER_1 = `recipe-inner-1`,
RECIPE_INNER_2 = `recipe-inner-2`,
INGREDIENT = `ingredient`,
AMOUNT = `amount`,
RECIPE_COMMENT = `recipe-comment`,
REPORT_BUTTON = `report-button`,
REPORT_ICON = `report-icon`,
DESCRIPTION = `plate-description`,
TEXT = `text`;


const 
  adPicture = `./orange.png`;

@inject(SERVICES.API_SERVICE, SERVICES.ROUTING_SERVICE, SERVICES.SHARED_SERVICE)
@observer
export default class MainRoute extends AbstractComponent {

  private firstBlock = TEST_VALID => TEST_VALID.PLATES.map((d, i) =>
    <div className={`padding-10`} key={i}>
          <div className={`${PROFILE_CONTAINER} padding-top-10`}>
            <div className={`${PROFILE_PIC}`}>
              <TP_BackgroundImage source={d.author.image}/>   
            </div>  
            <div className={`${INNER_CONTAINER}`}>
              <span className={`${AUTHOR_NAME} `}>{d.author.name}</span>  
              <span className={`${GEO_LOCATION} `}> <FiMapPin className={`brand-green`}/> {d.geo}</span>
            </div>   
            <div className={`${REPLY} padding-left-50`}>
              <BsReply/>
            </div>
          </div>
          <div className={`${VIDEO} pos-rel padding-top-10`} >
            <TP_BackgroundImage source={d.video}/>
              <div className={`${OVERLAY}`}>
                <div className={`${LIKE}`}>
                  <div className={`${LIKE_NUMBER}`}>
                    {d.likes.length}
                  </div>
                  <BiLike className={`${LIKE_ICON}`}/>
                </div>
              </div>   
          </div>  
          <div className={`${NAME_RECIPE}`}>
            <span className = {`${NAME}`} >{d.name}</span>
            <div className = {`${WEEK}`}>
              <span>Published </span>
              <Moment format={"DD MMMM YYYY"}>{d.week}</Moment>
            </div>
            
            <div className = {`${RECIPE} padding-top-20`}>
              <div className = {`${RECIPE_HEADER}`}>Recipe</div>
                <div>{d.ingredients.map((k,j) =>
                    <div key={j} className={`${RECIPE_INNER_1}`}>
                      <div className={`${RECIPE_INNER_2}`}>
                      <div className={`${INGREDIENT}`}>{k.ingredient}</div>
                      <div className={`${AMOUNT}`}>{k.value}</div>
                      </div>
                      <div className={`${RECIPE_COMMENT}`}>{k.comment}</div>
                    </div>
                )}</div>
            </div>
            
            <div className={`${DESCRIPTION}`}>
              {d.description}
            </div>
            <div>
              <button className={`${REPORT_BUTTON}`}>
                  <AiOutlineWarning className={`${REPORT_ICON}`}/> REPORT
              </button>
            </div>
          </div>    
    </div>
  );

  private changePage = () => this.services.routingService.goTo(ROUTES.HOME);

  render () {   
    return <div className={`${ROOT} tp-route`}>
      <TP_Button onClick={() => this.changePage()}>     
              <span>PAGECHANGE</span>
      </TP_Button>

      <div className={`container`}>
        <div className={`row`}>
          <div className={`col-12 col-lg-2 col-xl-2`}>       
          </div>
          <div className={`col-12 col-lg-6 col-xl-6`}>
            {this.firstBlock(TEST_VALID)}        
          </div>
          <div className={`col-12 col-lg-3 col-xl-3`}>     
            <div className={`${AD} padding-top-100`}>
              <TP_BackgroundImage source={adPicture}/>
            </div>  
          </div>
        </div>
      </div>  


    </div>;
  }

  componentDidMount() {}

}